import React, { createContext, useContext, useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  isRemoteEnabled,
  remoteVerifyLogin,
  completeRemoteLogin,
  remoteLogout,
  remoteCreateCredential,
  remoteChangePassword,
  remoteResetPassword,
  remoteAdminResetPassword,
  remoteRegisterStudentCredential,
  remoteSubmitAdmissionApplication,
  remoteSubmitContactInquiry,
  pushAllDataToSupabase,
} from '../lib/supabase';
import { 
  AppImages, 
  Notice, 
  AdmissionApplication, 
  EntranceExamSettings,
  Homework, 
  GradeRecord, 
  ContactInquiry, 
  PageSection,
  StudentProfile,
  TutorProfile,
  PrincipalRole,
  PrincipalPrivilege,
  CalvinToken,
  FacultyMember,
  SchoolInfo,
  SchoolClass,
  Subject,
  GradeRule,
  ParentBroadcastLog,
  ProprietressProfile,
  ProprietressAppointment,
  ProprietressMessage,
  ProprietressDirective,
  AssessmentControlConfig,
  AssessmentEntryPhase,
  HistoricalSessionRecord,
  HistoricalTermRecord,
  UserRole,
  UserCredentialItem,
  StudentRegistrationData,
  LessonNote,
  LessonNoteAttachment,
  NoteFormat,
  HeroSlide,
  KeyPillarItem,
  KeyPillarsHeader,
  AboutSectionContent,
  FeaturedCourse,
  TestimonialsSectionContent,
  AcademicProgram,
  Testimonial,
  BusRoute,
  MealMenuItem,
  Club,
  HouseStanding,
  AcademicCalendarEvent,
  FAQItem,
  FAQSectionContent,
  AttendanceStatus,
  AttendanceStudentEntry,
  AttendanceDailyRecord,
  StudentAttendanceSummary,
  TermResumptionConfig,
  ClassAttendanceSummary,
  CbtExam,
  CbtQuestion,
  CbtAttempt,
  ClassWeeklyTimetable,
  SickBayVisitLog,
  ParentProfile,
  ParentConsultationRequest,
  FeePaymentRecord,
  LibraryBookItem,
  SchemeOfWork,
  ChatChannel,
  SchoolChatMessage,
  GalleryPhoto,
  UserEphemeralStatus,
  SchoolNewsArticle,
  StudentArticleSubmission,
  StatusViewerRecord,
  SchoolRepRole,
  SchoolRepConfig,
  VisitorChatMessage,
  VisitorConversation,
  ChatAppointment,
  ChatTransferRecord,
  HeadmistressProfile,
  ModeratorProfile,
  PrivilegeKey,
  RolePrivilegeSettings
} from '../types';
import { 
  DEFAULT_ROLE_PRIVILEGES, 
  DEFAULT_HEADMISTRESS_PROFILE, 
  DEFAULT_MODERATORS 
} from '../data/rolePrivilegesData';
import { cleanExpiredStatuses, create16HourStatus, INITIAL_EPHEMERAL_STATUSES } from '../data/defaultEphemeralStatuses';
import { DEFAULT_GALLERY_PHOTOS } from '../data/defaultGalleryPhotos';
import { DEFAULT_NEWS_ARTICLES } from '../data/defaultNewsArticles';
import { defaultSchemesOfWork } from '../data/defaultSchemesOfWork';
import { INITIAL_LESSON_NOTES } from '../data/initialLessonNotes';
import { DEFAULT_FAQ_ITEMS, DEFAULT_FAQ_CONTENT } from '../data/faqData';
import { 
  DEFAULT_IMAGES, 
  RECENT_NOTICES, 
  INITIAL_APPLICATIONS, 
  INITIAL_BROADCAST_LOGS,
  DEMO_STUDENT, 
  DEMO_STUDENTS,
  DEMO_TUTOR, 
  DEMO_TUTORS,
  DEMO_HOMEWORKS, 
  DEFAULT_ASSESSMENT_CONFIG,
  FACULTY_MEMBERS,
  SCHOOL_INFO,
  DEFAULT_SCHOOL_STATS,
  DEFAULT_CLASSES,
  DEFAULT_SUBJECTS,
  DEFAULT_GRADING_SYSTEM,
  DEFAULT_PROPRIETRESS_PROFILE,
  DEFAULT_PROPRIETRESS_APPOINTMENTS,
  DEFAULT_PROPRIETRESS_MESSAGES,
  DEFAULT_PROPRIETRESS_DIRECTIVES,
  generateStudentHistoricalRecords,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HERO_HIGHLIGHTS,
  DEFAULT_KEY_PILLARS,
  DEFAULT_KEY_PILLARS_HEADER,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_TESTIMONIALS_HEADER,
  DEFAULT_ACADEMIC_PROGRAMS,
  DEFAULT_FEATURED_COURSES,
  DEFAULT_CLUBS_LIST,
  DEFAULT_HOUSE_STANDINGS,
  DEFAULT_BUS_ROUTES,
  DEFAULT_MEAL_MENU,
  DEFAULT_CALENDAR_EVENTS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CBT_EXAMS,
  DEFAULT_WEEKLY_TIMETABLES,
  DEFAULT_SICK_BAY_LOGS,
  DEFAULT_PARENTS,
  DEFAULT_PARENT_CONSULTATIONS,
  DEFAULT_FEE_PAYMENTS,
  DEFAULT_LIBRARY_BOOKS,
  DEFAULT_CBT_ATTEMPTS,
  DEFAULT_CHAT_CHANNELS,
  DEFAULT_CHAT_MESSAGES,
  DEFAULT_SCHOOL_REP_CONFIG,
  DEFAULT_VISITOR_CONVERSATIONS
} from '../data/schoolData';

interface SchoolContextType {
  // 1. Media
  images: AppImages;
  updateImage: (key: keyof AppImages, newUrlOrData: string) => void;
  resetImagesToDefault: () => void;
  
  // 2. School Core Info & Contacts
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;
  resetSchoolInfo: () => void;
  resetSchoolInfoToDefault: () => void;
  updateSchoolStats: (stats: Array<{ label: string; value: string }>) => void;
  resetSchoolStatsToDefault: () => void;

  // 2B. Proprietress Desk & Functions
  proprietressProfile: ProprietressProfile;
  updateProprietressProfile: (info: Partial<ProprietressProfile>) => void;
  resetProprietressProfileToDefault: () => void;
  
  appointments: ProprietressAppointment[];
  bookAppointment: (appt: Omit<ProprietressAppointment, 'id' | 'refNumber' | 'status' | 'submittedAt'>) => string;
  updateAppointmentStatus: (id: string, status: ProprietressAppointment['status'], executiveResponse?: string) => void;
  deleteAppointment: (id: string) => void;

  messagesToProprietress: ProprietressMessage[];
  sendMessageToProprietress: (msg: Omit<ProprietressMessage, 'id' | 'refNumber' | 'date' | 'status'>) => string;
  updateProprietressMessageStatus: (id: string, status: ProprietressMessage['status'], note?: string) => void;
  deleteProprietressMessage: (id: string) => void;

  directives: ProprietressDirective[];
  addDirective: (dir: Omit<ProprietressDirective, 'id'>) => void;
  updateDirective: (id: string, updated: Partial<ProprietressDirective>) => void;
  deleteDirective: (id: string) => void;
  resetDirectivesToDefault: () => void;

  // 3. Faculty Members (Landing Page Staff)
  facultyList: FacultyMember[];
  addFacultyMember: (member: Omit<FacultyMember, 'id'>) => void;
  updateFacultyMember: (id: string, updated: Partial<FacultyMember>) => void;
  deleteFacultyMember: (id: string) => void;
  resetFacultyToDefault: () => void;

  // 4. Classes & Tuition Fees
  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, updated: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;
  resetClassesToDefault: () => void;
  assignClassTeacher: (classId: string, tutorId?: string) => void;

  // 5. Subjects & Curriculum
  subjects: Subject[];
  addSubject: (subj: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updated: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  resetSubjectsToDefault: () => void;

  // 6. Grading System
  gradingSystem: GradeRule[];
  gradingRules: GradeRule[];
  updateGradingRule: (id: string, updated: Partial<GradeRule>) => void;
  addGradingRule: (rule: Omit<GradeRule, 'id'>) => void;
  deleteGradingRule: (id: string) => void;
  resetGradingSystem: () => void;
  resetGradingToDefault: () => void;
  calculateGrade: (totalScore: number) => { grade: string; remark: string; color: string };

  // 7. Tutors & Assigned Subjects
  tutors: TutorProfile[];
  tutor: TutorProfile;
  activeTutorId: string;
  setActiveTutorId: (id: string) => void;
  switchActiveTutor: (id: string) => void;
  assignSubjectsToTutor: (tutorId: string, subjects: string[]) => void;
  updateTutor: (id: string, updated: Partial<TutorProfile>) => void;
  addTutor: (tutor: Omit<TutorProfile, 'id'>) => void;
  deleteTutor: (id: string) => void;

  // 8. Notices
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, updated: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  
  // 9. Admissions & Parent Broadcast
  applications: AdmissionApplication[];
  submitApplication: (app: Omit<AdmissionApplication, 'id' | 'refNumber' | 'dateSubmitted' | 'status' | 'screeningDate'>) => string;
  updateApplicationStatus: (id: string, status: AdmissionApplication['status'], screeningDate?: string) => void;
  updateApplicationExamDetails: (id: string, details: Partial<AdmissionApplication>) => void;
  entranceExamSettings: EntranceExamSettings;
  updateEntranceExamSettings: (settings: Partial<EntranceExamSettings>) => void;
  resetEntranceExamSettings: () => void;
  broadcastLogs: ParentBroadcastLog[];
  addBroadcastLog: (log: Omit<ParentBroadcastLog, 'id' | 'dateSent'>) => void;
  
  // 10. Student & Homeworks
  students: StudentProfile[];
  student: StudentProfile;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  switchActiveStudent: (id: string) => void;
  updateStudent: (id: string, updated: Partial<StudentProfile>) => void;
  registerStudent: (data: StudentRegistrationData) => StudentProfile;
  updateStudentPassport: (studentId: string, passportPhoto: string) => void;
  deleteStudent: (id: string) => void;
  homeworks: Homework[];
  toggleHomeworkStatus: (id: string, studentId?: string) => void;
  addHomework: (hw: Omit<Homework, 'id' | 'status'>) => void;
  deleteHomework: (id: string) => void;
  
  // 11. Grades & Assessments
  grades: GradeRecord[];
  updateGrade: (subject: string, ca1: number, ca2: number, exam: number, ca3?: number, studentId?: string) => void;
  getStudentGrades: (studentId: string) => GradeRecord[];
  assessmentConfig: AssessmentControlConfig;
  updateAssessmentConfig: (config: Partial<AssessmentControlConfig>) => void;
  setActiveAssessmentPhase: (phase: AssessmentEntryPhase) => void;
  setActiveAssessmentTerm: (term: '1st Term' | '2nd Term' | '3rd Term') => void;
  setPromotionPassMark: (percent: number) => void;
  availableSessions: string[];
  startNewAcademicSession: (newSessionName: string, passMarkPercentage?: number) => {
    promotedCount: number;
    repeatedCount: number;
    upgradedStudents: Array<{
      id: string;
      name: string;
      oldClass: string;
      newClass: string;
      passed: boolean;
      average: number;
    }>;
  };
  resetAssessmentToDefault: () => void;
  getNextClass: (currentGrade: string) => string;
  toggleAutoRanking: (enabled?: boolean) => void;
  getClassRankings: (className: string, term?: string) => Array<{
    student: StudentProfile;
    rank: number;
    positionText: string;
    average: number;
    totalScore: number;
  }>;
  
  // 12. Inquiries
  inquiries: ContactInquiry[];
  submitInquiry: (name: string, email: string, subject: string, message: string) => void;
  
  // 13. Authentication & Security (Universal Single Sign-On)
  isAdminAuthenticated: boolean;
  isProprietressAuthenticated: boolean;
  isHeadmistressAuthenticated: boolean;
  isModeratorAuthenticated: boolean;
  isStudentAuthenticated: boolean;
  isTutorAuthenticated: boolean;
  authenticatedRole: UserRole | null;
  universalLogin: (identifier: string, pass: string) => Promise<{
    success: boolean;
    role?: UserRole;
    message?: string;
    targetSection?: PageSection;
    isAlumni?: boolean;
  }>;
  loginAdmin: (user: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
  loginProprietress: (user: string, pass: string) => Promise<boolean>;
  logoutProprietress: () => void;
  loginHeadmistress: (user: string, pass: string) => Promise<boolean>;
  logoutHeadmistress: () => void;
  loginModerator: (user: string, pass: string) => Promise<boolean>;
  logoutModerator: () => void;
  loginStudent: (identifier: string, pin: string) => Promise<{ success: boolean; message?: string; student?: StudentProfile }>;
  logoutStudent: () => void;
  loginTutor: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string; tutor?: TutorProfile }>;
  logoutTutor: () => void;
  logoutAll: () => void;

  // Head Mistress Desk & Profiles
  headmistressProfile: HeadmistressProfile;
  updateHeadmistressProfile: (data: Partial<HeadmistressProfile>) => void;

  // Moderators & Oversight
  moderators: ModeratorProfile[];
  addModerator: (data: Omit<ModeratorProfile, 'id'>) => ModeratorProfile;
  updateModerator: (id: string, data: Partial<ModeratorProfile>) => void;
  deleteModerator: (id: string) => void;
  activeModeratorId: string;
  setActiveModeratorId: (id: string) => void;

  // Role Delegated Privileges
  rolePrivileges: RolePrivilegeSettings;
  updateRolePrivilege: (role: 'headmistress' | 'moderator' | 'tutor' | 'student' | 'parent', key: PrivilegeKey, granted: boolean) => void;
  resetRolePrivileges: (role?: 'headmistress' | 'moderator' | 'tutor') => void;
  hasPrivilege: (role: UserRole, key: PrivilegeKey) => boolean;

  // 13B. Alumni & Privileges Management
  toggleStudentAlumni: (studentId: string, isAlumni: boolean, graduationSession?: string) => void;
  upgradeStudentToTutor: (studentId: string) => { success: boolean; tutorId?: string; message: string };
  completeTutorProfile: (tutorId: string, data: Partial<TutorProfile>) => void;
  createTutorAccount: (data: {
    name: string;
    email: string;
    staffId?: string;
    password: string;
    department: string;
    role: string;
    qualification: string;
    assignedClasses: string[];
    assignedSubjects: string[];
    phone?: string;
    bio?: string;
  }) => TutorProfile;

  // 13C. Password Management & Admin Security Vault
  changePassword: (userRole: UserRole, currentPass: string, newPass: string, userId?: string) => { success: boolean; message: string };
  forgotPasswordReset: (identifier: string, newPassword: string) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  getSecurityQuestionForUser: (identifier: string) => {
    exists: boolean;
    hasQuestion: boolean;
    securityQuestion?: string;
    name?: string;
    role?: UserRole;
    message?: string;
  };
  resetPasswordWithSecurityAnswer: (identifier: string, securityAnswer: string, newPassword: string) => Promise<{
    success: boolean;
    message: string;
    role?: UserRole;
  }>;
  getAllUserCredentials: () => UserCredentialItem[];
  adminResetUserPassword: (userId: string, userRole: UserRole, newPassword: string) => boolean;
  adminSecurityQuestion: string;
  adminSecurityAnswer: string;
  updateAdminSecurityQuestion: (question: string, answer: string) => { success: boolean; message: string };

  // 14. Lesson Notes & Academic Materials
  lessonNotes: LessonNote[];
  notesFeatureEnabled: boolean;
  addLessonNote: (note: Omit<LessonNote, 'id' | 'datePublished' | 'downloadsCount'>) => LessonNote;
  deleteLessonNote: (id: string) => boolean;
  toggleNotesFeature: (enabled?: boolean) => void;
  deleteTermNotes: (term?: string, session?: string) => number;
  exportNotesZip: (term?: string, session?: string) => Promise<{ success: boolean; count: number; filename: string }>;
  incrementNoteDownload: (id: string) => void;
  
  // 15. Navigation
  activeSection: PageSection;
  setActiveSection: (section: PageSection) => void;

  // 16. Landing Page CMS Content & Operations
  heroSlides: HeroSlide[];
  updateHeroSlide: (index: number, slide: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (index: number) => void;
  resetHeroSlidesToDefault: () => void;

  heroHighlights: string[];
  updateHeroHighlights: (highlights: string[]) => void;
  resetHeroHighlightsToDefault: () => void;

  keyPillars: KeyPillarItem[];
  keyPillarsHeader: KeyPillarsHeader;
  updateKeyPillar: (id: string, pillar: Partial<KeyPillarItem>) => void;
  addKeyPillar: (pillar: Omit<KeyPillarItem, 'id'>) => void;
  deleteKeyPillar: (id: string) => void;
  updateKeyPillarsHeader: (header: Partial<KeyPillarsHeader>) => void;
  resetKeyPillarsToDefault: () => void;

  aboutContent: AboutSectionContent;
  updateAboutContent: (content: Partial<AboutSectionContent>) => void;
  resetAboutContentToDefault: () => void;
  resetAboutContent: () => void;

  academicPrograms: AcademicProgram[];
  updateAcademicProgram: (id: string, program: Partial<AcademicProgram>) => void;
  addAcademicProgram: (prog: Omit<AcademicProgram, 'id'>) => void;
  deleteAcademicProgram: (id: string) => void;
  resetAcademicProgramsToDefault: () => void;

  featuredCourses: FeaturedCourse[];
  updateFeaturedCourse: (id: string, course: Partial<FeaturedCourse>) => void;
  addFeaturedCourse: (course: Omit<FeaturedCourse, 'id'>) => void;
  deleteFeaturedCourse: (id: string) => void;
  resetFeaturedCoursesToDefault: () => void;

  clubsList: Club[];
  clubs: Club[];
  updateClub: (id: string, club: Partial<Club>) => void;
  addClub: (club: Omit<Club, 'id'>) => void;
  deleteClub: (id: string) => void;
  resetClubsToDefault: () => void;

  houseStandings: HouseStanding[];
  updateHouseStanding: (name: string, house: Partial<HouseStanding>) => void;
  addHouseStanding: (house: HouseStanding) => void;
  deleteHouseStanding: (name: string) => void;
  resetHouseStandingsToDefault: () => void;

  busRoutes: BusRoute[];
  updateBusRoute: (id: string, route: Partial<BusRoute>) => void;
  addBusRoute: (route: Omit<BusRoute, 'id'>) => void;
  deleteBusRoute: (id: string) => void;
  resetBusRoutesToDefault: () => void;

  mealMenu: MealMenuItem[];
  updateMealMenuItem: (day: string, item: Partial<MealMenuItem>) => void;
  resetMealMenuToDefault: () => void;

  calendarEvents: AcademicCalendarEvent[];
  updateCalendarEvent: (id: string, event: Partial<AcademicCalendarEvent>) => void;
  addCalendarEvent: (event: Omit<AcademicCalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  resetCalendarEventsToDefault: () => void;

  testimonials: Testimonial[];
  testimonialsHeader: TestimonialsSectionContent;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  updateTestimonialsHeader: (header: Partial<TestimonialsSectionContent>) => void;
  resetTestimonialsToDefault: () => void;

  // 17. Frequently Asked Questions (FAQ) Section
  faqItems: FAQItem[];
  faqHeader: FAQSectionContent;
  faqContent: FAQSectionContent;
  updateFaqItem: (id: string, item: Partial<FAQItem>) => void;
  addFaqItem: (item: Omit<FAQItem, 'id'>) => void;
  deleteFaqItem: (id: string) => void;
  updateFaqHeader: (header: Partial<FAQSectionContent>) => void;
  updateFaqContent: (header: Partial<FAQSectionContent>) => void;
  resetFaqToDefault: () => void;
  resetFaqsToDefault: () => void;

  // 18. Complete Database Resilience (Zero Data Loss on Free Hosting: Vercel / GitHub)
  exportDatabaseSnapshot: () => string;
  importDatabaseSnapshot: (jsonData: string) => { success: boolean; message: string; recordCounts?: Record<string, number> };
  syncEntireDatabaseToSupabase: () => Promise<{ ok: boolean; message: string; count?: number }>;

  // 19. Attendance & Term Resumption Management
  attendanceRecords: AttendanceDailyRecord[];
  termResumptionConfig: TermResumptionConfig;
  setTermStartDate: (
    date: string,
    options?: {
      termEndDate?: string;
      termName?: string;
      sessionName?: string;
      shouldResetAttendance?: boolean;
    }
  ) => void;
  setTermResumptionDate: (date: string, termName?: string, sessionName?: string, termEndDate?: string) => void;
  resetDailyAttendanceCounter: () => void;
  startNewTerm: (termName: string, startDate: string, sessionName?: string, endDate?: string) => void;
  submitDailyAttendance: (record: Omit<AttendanceDailyRecord, 'id' | 'submittedAt'>) => AttendanceDailyRecord;
  getClassAttendanceSummary: (classId: string, term?: string) => ClassAttendanceSummary;
  getStudentAttendanceSummary: (studentId: string, term?: string) => StudentAttendanceSummary;

  // 20. CBT Practice & Examination Engine
  cbtExams: CbtExam[];
  cbtAttempts: CbtAttempt[];
  addCbtExam: (exam: Omit<CbtExam, 'id'>) => CbtExam;
  deleteCbtExam: (id: string) => void;
  recordCbtAttempt: (attempt: Omit<CbtAttempt, 'id' | 'dateAttempted'>) => CbtAttempt;

  // 21. Weekly Timetable & Bell Schedule
  timetables: ClassWeeklyTimetable[];
  updateClassTimetable: (classId: string, schedule: ClassWeeklyTimetable['schedule']) => void;

  // 22. Medical & Clinic Sick-Bay
  sickBayLogs: SickBayVisitLog[];
  addSickBayLog: (log: Omit<SickBayVisitLog, 'id'>) => SickBayVisitLog;
  updateSickBayLog: (id: string, updated: Partial<SickBayVisitLog>) => void;
  deleteSickBayLog: (id: string) => void;

  // 23. Parent Portal & Family Linkage
  parents: ParentProfile[];
  activeParentId: string;
  isParentAuthenticated: boolean;
  addParent: (parent: Omit<ParentProfile, 'id'>) => void;
  updateParent: (id: string, updated: Partial<ParentProfile>) => void;
  deleteParent: (id: string) => void;
  loginParent: (phoneOrEmail: string, pass: string) => Promise<{ success: boolean; message?: string; parent?: ParentProfile }>;
  logoutParent: () => void;
  consultationRequests: ParentConsultationRequest[];
  submitConsultationRequest: (req: Omit<ParentConsultationRequest, 'id' | 'createdAt' | 'status'>) => ParentConsultationRequest;
  updateConsultationStatus: (id: string, status: ParentConsultationRequest['status'], adminResponse?: string) => void;
  feePayments: FeePaymentRecord[];
  recordFeePayment: (payment: Omit<FeePaymentRecord, 'id' | 'status'>) => FeePaymentRecord;
  verifyFeePayment: (id: string, verifiedBy?: string) => void;
  rejectFeePayment: (id: string, rejectedBy?: string) => void;

  // 24. Digital Library & E-Textbooks
  libraryBooks: LibraryBookItem[];
  addLibraryBook: (book: Omit<LibraryBookItem, 'id' | 'downloadsCount'>) => LibraryBookItem;
  deleteLibraryBook: (id: string) => void;
  incrementBookDownload: (id: string) => void;

  // 25. Calvin AI Tokens & Student Access
  calvinTokens: CalvinToken[];
  createCalvinTokens: (tier: 'regular' | 'premium', durationHours: number, count?: number, priceNgn?: number, customDurationLabel?: string) => CalvinToken[];
  redeemCalvinToken: (studentId: string, code: string) => { success: boolean; message: string; tier?: 'regular' | 'premium'; expiresAt?: string };
  revokeCalvinToken: (tokenId: string) => void;
  grantDirectCalvinAccess: (studentId: string, tier: 'regular' | 'premium', durationHours: number) => void;
  recordCalvinQuestionAsked: (studentId: string) => void;
  sendTokenActivationPrompt: (studentIds: string[], options: { tokenCode?: string; tier?: 'regular' | 'premium'; durationLabel?: string; customMessage?: string; autoAllocateToken?: boolean; durationHours?: number }) => { success: boolean; count: number; message: string };
  dismissTokenPrompt: (studentId: string) => void;
  acceptTokenPromptAndActivate: (studentId: string) => { success: boolean; message: string; tier?: 'regular' | 'premium' };

  // 26. Staff Photo, Signature & Principal Appointments
  appointPrincipal: (tutorId: string, principalRole: PrincipalRole, privileges: PrincipalPrivilege[]) => void;
  updateTutorPhotoAndSignature: (tutorId: string, data: { photoUrl?: string; signatureUrl?: string }) => void;

  // 27. Subject Schemes of Work & AI Curriculum Grounding
  schemesOfWork: SchemeOfWork[];
  addSchemeOfWork: (scheme: Omit<SchemeOfWork, 'id' | 'lastUpdated'>) => SchemeOfWork;
  updateSchemeOfWork: (id: string, updates: Partial<SchemeOfWork>) => void;
  deleteSchemeOfWork: (id: string) => boolean;
  resetSchemesToDefault: () => void;
  getSchemeForSubjectAndClass: (subjectName: string, classLevel?: string, term?: string) => SchemeOfWork | undefined;

  // 28. School Community Chat System (Students, Parents, Tutors & Admin)
  chatChannels: ChatChannel[];
  chatMessages: SchoolChatMessage[];
  addChatChannel: (channel: Omit<ChatChannel, 'id' | 'createdAt'>) => ChatChannel;
  updateChatChannel: (id: string, updates: Partial<ChatChannel>) => void;
  deleteChatChannel: (id: string) => void;
  sendChatMessage: (msg: Omit<SchoolChatMessage, 'id' | 'timestamp'>) => SchoolChatMessage;
  deleteChatMessage: (id: string) => void;
  flagChatMessage: (id: string, flagged?: boolean) => void;
  resetChatToDefault: () => void;
  toggleChatReaction: (messageId: string, emoji: string, userName: string) => void;
  togglePinChatMessage: (messageId: string, pinnedBy?: string) => void;
  markChannelAsRead: (channelId: string, userId: string) => void;
  getChannelUnreadCount: (channelId: string, userId: string) => number;
  getTotalUnreadCount: (userId: string, authorizedChannelIds?: string[]) => number;
  isFloatingChatOpen: boolean;
  setIsFloatingChatOpen: (open: boolean) => void;
  activeFloatingChatChannelId: string | null;
  setActiveFloatingChatChannelId: (channelId: string | null) => void;

  // 29. Campus Gallery Photos (Facilities & Events)
  galleryPhotos: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id' | 'uploadedAt'>) => void;
  updateGalleryPhoto: (id: string, updates: Partial<GalleryPhoto>) => void;
  deleteGalleryPhoto: (id: string) => void;
  resetGalleryPhotosToDefault: () => void;

  // 30. Prefects, Club Leaders & Ephemeral 16-Hour Statuses
  assignClassPrefects: (classId: string, prefectStudentId?: string, assistantPrefectStudentId?: string) => void;
  assignClubLeaders: (clubId: string, presidentStudentId?: string, vicePresidentStudentId?: string, memberStudentIds?: string[]) => void;
  assignStudentPrefectBadge: (studentId: string, prefectRole?: string, prefectBadge?: string) => void;
  updateStudentChatSettings: (studentId: string, settings: { showOnlineStatus?: boolean; allowDirectMessages?: boolean; dmPermission?: 'classmates_only' | 'anyone' }) => void;
  ephemeralStatuses: UserEphemeralStatus[];
  postEphemeralStatus: (status: Omit<UserEphemeralStatus, 'id' | 'createdAt' | 'expiresAt' | 'views'>) => void;
  deleteEphemeralStatus: (id: string) => void;
  markEphemeralStatusViewed: (statusId: string, viewerId: string, viewerName?: string, viewerRole?: string) => void;

  // 31. School News & Blog System (Press Club President & Nominated Editors)
  newsArticles: SchoolNewsArticle[];
  addNewsArticle: (article: Omit<SchoolNewsArticle, 'id' | 'publishedAt'>) => void;
  updateNewsArticle: (id: string, updates: Partial<SchoolNewsArticle>) => void;
  deleteNewsArticle: (id: string) => void;
  likeNewsArticle: (id: string) => void;
  pressClubPresidentStudentId: string | undefined;
  pressClubEditorStudentIds: string[];
  assignPressClubPresident: (studentId: string | undefined) => void;
  nominatePressClubEditor: (studentId: string) => void;
  removePressClubEditor: (studentId: string) => void;
  resetNewsArticlesToDefault: () => void;
  studentSubmissions: StudentArticleSubmission[];
  submitArticleForReview: (submission: Omit<StudentArticleSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  reviewStudentSubmission: (id: string, decision: 'approved' | 'rejected', reason?: string) => void;

  // 32. School Representative & Landing Page Visitor Live Chat
  schoolRepConfig: SchoolRepConfig;
  updateSchoolRepConfig: (updates: Partial<SchoolRepConfig>) => void;
  toggleRepAvailability: (available?: boolean) => void;
  visitorConversations: VisitorConversation[];
  sendVisitorMessage: (
    visitorId: string, 
    message: string, 
    visitorInfo?: { name?: string; phone?: string; email?: string; category?: any; language?: string },
    attachment?: { url: string; name: string; type: 'image' | 'document' | 'audio'; audioDuration?: number }
  ) => Promise<VisitorChatMessage | null>;
  replyAsRepresentative: (
    visitorId: string, 
    replyContent: string, 
    repInfo?: { name?: string; title?: string },
    attachment?: { url: string; name: string; type: 'image' | 'document' | 'audio'; audioDuration?: number }
  ) => void;
  requestCalvinAiInstantReply: (visitorId: string) => Promise<VisitorChatMessage | null>;
  getVisitorConversation: (visitorId: string) => VisitorConversation | undefined;
  markVisitorConversationRead: (visitorId: string) => void;
  markConversationSeenByAdmin: (visitorId: string) => void;
  markConversationSeenByVisitor: (visitorId: string) => void;
  setChatTyping: (visitorId: string, sender: 'representative' | 'visitor', isTyping: boolean, senderName?: string) => Promise<void>;
  typingMap: Record<string, { isRepTyping?: boolean; repName?: string; isVisitorTyping?: boolean; visitorName?: string }>;
  bookChatAppointment: (
    visitorId: string, 
    appointmentData: Omit<ChatAppointment, 'id' | 'createdAt' | 'status'>
  ) => Promise<ChatAppointment>;
  transferConversationDepartment: (
    visitorId: string, 
    targetRole: SchoolRepRole, 
    targetRepName: string, 
    targetRepTitle: string, 
    reason?: string
  ) => void;
  updateVisitorNotificationOptIn: (
    visitorId: string, 
    optIn: { whatsapp?: boolean; sms?: boolean; phone?: string; email?: string }
  ) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Manage Dynamic Images (Persistent in localStorage)
  const [images, setImages] = useState<AppImages>(() => {
    try {
      const saved = localStorage.getItem('stanbax_app_images');
      if (saved) {
        return { ...DEFAULT_IMAGES, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_IMAGES;
  });

  const updateImage = (key: keyof AppImages, newUrlOrData: string) => {
    setImages(prev => {
      const updated = { ...prev, [key]: newUrlOrData };
      try {
        localStorage.setItem('stanbax_app_images', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage quota exceeded or error storing image', err);
      }
      return updated;
    });
  };

  const resetImagesToDefault = () => {
    setImages(DEFAULT_IMAGES);
    try {
      localStorage.removeItem('stanbax_app_images');
    } catch {}
  };

  // 2. School Core Info (Address, Phone, WhatsApp, Term, Year)
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    try {
      const saved = localStorage.getItem('stanbax_school_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        const stats = (parsed.stats && Array.isArray(parsed.stats) && parsed.stats.length > 0)
          ? parsed.stats
          : DEFAULT_SCHOOL_STATS;
        return { ...SCHOOL_INFO, ...parsed, stats };
      }
    } catch {}
    return { ...SCHOOL_INFO, stats: DEFAULT_SCHOOL_STATS };
  });

  const updateSchoolInfo = (info: Partial<SchoolInfo>) => {
    setSchoolInfo(prev => {
      const updated = { ...prev, ...info };
      try {
        localStorage.setItem('stanbax_school_info', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateSchoolStats = (newStats: Array<{ label: string; value: string }>) => {
    updateSchoolInfo({ stats: newStats });
  };

  const resetSchoolStatsToDefault = () => {
    updateSchoolInfo({ stats: DEFAULT_SCHOOL_STATS });
  };

  const resetSchoolInfo = () => {
    setSchoolInfo({ ...SCHOOL_INFO, stats: DEFAULT_SCHOOL_STATS });
    try {
      localStorage.removeItem('stanbax_school_info');
    } catch {}
  };

  // 2C. Landing Page CMS State & Handlers (Persistent in localStorage)
  // Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_hero_slides');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_HERO_SLIDES;
  });

  const updateHeroSlide = (index: number, slideUpdate: Partial<HeroSlide>) => {
    setHeroSlides(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...slideUpdate };
      }
      try {
        localStorage.setItem('stanbax_hero_slides', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addHeroSlide = (newSlide: HeroSlide) => {
    setHeroSlides(prev => {
      const updated = [...prev, newSlide];
      try {
        localStorage.setItem('stanbax_hero_slides', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteHeroSlide = (index: number) => {
    setHeroSlides(prev => {
      if (prev.length <= 1) {
        return prev;
      }
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('stanbax_hero_slides', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetHeroSlidesToDefault = () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    try {
      localStorage.removeItem('stanbax_hero_slides');
    } catch {}
  };

  // Hero Highlights
  const [heroHighlights, setHeroHighlights] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_hero_highlights');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_HERO_HIGHLIGHTS;
  });

  const updateHeroHighlights = (highlights: string[]) => {
    setHeroHighlights(highlights);
    try {
      localStorage.setItem('stanbax_hero_highlights', JSON.stringify(highlights));
    } catch {}
  };

  const resetHeroHighlightsToDefault = () => {
    setHeroHighlights(DEFAULT_HERO_HIGHLIGHTS);
    try {
      localStorage.removeItem('stanbax_hero_highlights');
    } catch {}
  };

  // Key Pillars
  const [keyPillars, setKeyPillars] = useState<KeyPillarItem[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_key_pillars');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_KEY_PILLARS;
  });

  const [keyPillarsHeader, setKeyPillarsHeader] = useState<KeyPillarsHeader>(() => {
    try {
      const saved = localStorage.getItem('stanbax_key_pillars_header');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_KEY_PILLARS_HEADER;
  });

  const updateKeyPillar = (id: string, pillarUpdate: Partial<KeyPillarItem>) => {
    setKeyPillars(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...pillarUpdate } : p);
      try {
        localStorage.setItem('stanbax_key_pillars', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addKeyPillar = (newPillar: Omit<KeyPillarItem, 'id'>) => {
    const item: KeyPillarItem = {
      ...newPillar,
      id: `pil-${Date.now()}`
    };
    setKeyPillars(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('stanbax_key_pillars', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteKeyPillar = (id: string) => {
    setKeyPillars(prev => {
      if (prev.length <= 1) {
        return prev;
      }
      const updated = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('stanbax_key_pillars', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateKeyPillarsHeader = (headerUpdate: Partial<KeyPillarsHeader>) => {
    setKeyPillarsHeader(prev => {
      const updated = { ...prev, ...headerUpdate };
      try {
        localStorage.setItem('stanbax_key_pillars_header', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetKeyPillarsToDefault = () => {
    setKeyPillars(DEFAULT_KEY_PILLARS);
    setKeyPillarsHeader(DEFAULT_KEY_PILLARS_HEADER);
    try {
      localStorage.removeItem('stanbax_key_pillars');
      localStorage.removeItem('stanbax_key_pillars_header');
    } catch {}
  };

  // About Section Content
  const [aboutContent, setAboutContent] = useState<AboutSectionContent>(() => {
    try {
      const saved = localStorage.getItem('stanbax_about_content');
      if (saved) return { ...DEFAULT_ABOUT_CONTENT, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_ABOUT_CONTENT;
  });

  const updateAboutContent = (contentUpdate: Partial<AboutSectionContent>) => {
    setAboutContent(prev => {
      const updated = { ...prev, ...contentUpdate };
      try {
        localStorage.setItem('stanbax_about_content', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetAboutContentToDefault = () => {
    setAboutContent(DEFAULT_ABOUT_CONTENT);
    try {
      localStorage.removeItem('stanbax_about_content');
    } catch {}
  };

  // Academic Programs
  const [academicPrograms, setAcademicPrograms] = useState<AcademicProgram[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_academic_programs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ACADEMIC_PROGRAMS;
  });

  const updateAcademicProgram = (id: string, progUpdate: Partial<AcademicProgram>) => {
    setAcademicPrograms(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...progUpdate } : p);
      try {
        localStorage.setItem('stanbax_academic_programs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addAcademicProgram = (newProg: Omit<AcademicProgram, 'id'>) => {
    const item: AcademicProgram = {
      ...newProg,
      id: `prog-${Date.now()}`
    };
    setAcademicPrograms(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('stanbax_academic_programs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteAcademicProgram = (id: string) => {
    setAcademicPrograms(prev => {
      if (prev.length <= 1) {
        return prev;
      }
      const updated = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('stanbax_academic_programs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetAcademicProgramsToDefault = () => {
    setAcademicPrograms(DEFAULT_ACADEMIC_PROGRAMS);
    try {
      localStorage.removeItem('stanbax_academic_programs');
    } catch {}
  };

  // Featured Courses
  const [featuredCourses, setFeaturedCourses] = useState<FeaturedCourse[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_featured_courses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FEATURED_COURSES;
  });

  const updateFeaturedCourse = (id: string, courseUpdate: Partial<FeaturedCourse>) => {
    setFeaturedCourses(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...courseUpdate } : c);
      try {
        localStorage.setItem('stanbax_featured_courses', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addFeaturedCourse = (newCourse: Omit<FeaturedCourse, 'id'>) => {
    const item: FeaturedCourse = {
      ...newCourse,
      id: `course-${Date.now()}`
    };
    setFeaturedCourses(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('stanbax_featured_courses', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteFeaturedCourse = (id: string) => {
    setFeaturedCourses(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('stanbax_featured_courses', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetFeaturedCoursesToDefault = () => {
    setFeaturedCourses(DEFAULT_FEATURED_COURSES);
    try {
      localStorage.removeItem('stanbax_featured_courses');
    } catch {}
  };

  // Student Life: Clubs
  const [clubsList, setClubsList] = useState<Club[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_clubs_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CLUBS_LIST;
  });

  const updateClub = (id: string, clubUpdate: Partial<Club>) => {
    setClubsList(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...clubUpdate } : c);
      try {
        localStorage.setItem('stanbax_clubs_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addClub = (newClub: Omit<Club, 'id'>) => {
    const item: Club = {
      ...newClub,
      id: `club-${Date.now()}`
    };
    setClubsList(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('stanbax_clubs_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteClub = (id: string) => {
    setClubsList(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('stanbax_clubs_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetClubsToDefault = () => {
    setClubsList(DEFAULT_CLUBS_LIST);
    try {
      localStorage.removeItem('stanbax_clubs_list');
    } catch {}
  };

  // Student Life: House Standings
  const [houseStandings, setHouseStandings] = useState<HouseStanding[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_house_standings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_HOUSE_STANDINGS;
  });

  const updateHouseStanding = (name: string, houseUpdate: Partial<HouseStanding>) => {
    setHouseStandings(prev => {
      const updated = prev.map(h => h.name === name ? { ...h, ...houseUpdate } : h);
      try {
        localStorage.setItem('stanbax_house_standings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addHouseStanding = (newHouse: HouseStanding) => {
    setHouseStandings(prev => {
      const updated = [...prev, newHouse];
      try {
        localStorage.setItem('stanbax_house_standings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteHouseStanding = (name: string) => {
    setHouseStandings(prev => {
      const updated = prev.filter(h => h.name !== name);
      try {
        localStorage.setItem('stanbax_house_standings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetHouseStandingsToDefault = () => {
    setHouseStandings(DEFAULT_HOUSE_STANDINGS);
    try {
      localStorage.removeItem('stanbax_house_standings');
    } catch {}
  };

  // Student Life: Bus Routes
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_bus_routes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BUS_ROUTES;
  });

  const updateBusRoute = (id: string, routeUpdate: Partial<BusRoute>) => {
    setBusRoutes(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...routeUpdate } : r);
      try {
        localStorage.setItem('stanbax_bus_routes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addBusRoute = (newRoute: Omit<BusRoute, 'id'>) => {
    const item: BusRoute = {
      ...newRoute,
      id: `route-${Date.now()}`
    };
    setBusRoutes(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('stanbax_bus_routes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteBusRoute = (id: string) => {
    setBusRoutes(prev => {
      const updated = prev.filter(r => r.id !== id);
      try {
        localStorage.setItem('stanbax_bus_routes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetBusRoutesToDefault = () => {
    setBusRoutes(DEFAULT_BUS_ROUTES);
    try {
      localStorage.removeItem('stanbax_bus_routes');
    } catch {}
  };

  // Student Life: Meal Menu
  const [mealMenu, setMealMenu] = useState<MealMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_meal_menu');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MEAL_MENU;
  });

  const updateMealMenuItem = (day: string, itemUpdate: Partial<MealMenuItem>) => {
    setMealMenu(prev => {
      const updated = prev.map(m => m.day.toLowerCase() === day.toLowerCase() ? { ...m, ...itemUpdate } : m);
      try {
        localStorage.setItem('stanbax_meal_menu', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetMealMenuToDefault = () => {
    setMealMenu(DEFAULT_MEAL_MENU);
    try {
      localStorage.removeItem('stanbax_meal_menu');
    } catch {}
  };

  // Academic Calendar Events
  const [calendarEvents, setCalendarEvents] = useState<AcademicCalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_calendar_events');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CALENDAR_EVENTS;
  });

  const updateCalendarEvent = (id: string, eventUpdate: Partial<AcademicCalendarEvent>) => {
    setCalendarEvents(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...eventUpdate } : e);
      try {
        localStorage.setItem('stanbax_calendar_events', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addCalendarEvent = (newEvent: Omit<AcademicCalendarEvent, 'id'>) => {
    const item: AcademicCalendarEvent = {
      ...newEvent,
      id: `cal-${Date.now()}`
    };
    setCalendarEvents(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('stanbax_calendar_events', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        localStorage.setItem('stanbax_calendar_events', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetCalendarEventsToDefault = () => {
    setCalendarEvents(DEFAULT_CALENDAR_EVENTS);
    try {
      localStorage.removeItem('stanbax_calendar_events');
    } catch {}
  };

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_testimonials');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TESTIMONIALS;
  });

  const [testimonialsHeader, setTestimonialsHeader] = useState<TestimonialsSectionContent>(() => {
    try {
      const saved = localStorage.getItem('stanbax_testimonials_header');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TESTIMONIALS_HEADER;
  });

  const updateTestimonial = (id: string, testUpdate: Partial<Testimonial>) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...testUpdate } : t);
      try {
        localStorage.setItem('stanbax_testimonials', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addTestimonial = (newTest: Omit<Testimonial, 'id'>) => {
    const item: Testimonial = {
      ...newTest,
      id: `test-${Date.now()}`
    };
    setTestimonials(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('stanbax_testimonials', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => {
      const updated = prev.filter(t => t.id !== id);
      try {
        localStorage.setItem('stanbax_testimonials', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateTestimonialsHeader = (headerUpdate: Partial<TestimonialsSectionContent>) => {
    setTestimonialsHeader(prev => {
      const updated = { ...prev, ...headerUpdate };
      try {
        localStorage.setItem('stanbax_testimonials_header', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetTestimonialsToDefault = () => {
    setTestimonials(DEFAULT_TESTIMONIALS);
    setTestimonialsHeader(DEFAULT_TESTIMONIALS_HEADER);
    try {
      localStorage.removeItem('stanbax_testimonials');
      localStorage.removeItem('stanbax_testimonials_header');
    } catch {}
  };

  // 17. Frequently Asked Questions (FAQ) Section (Persistent in localStorage)
  const [faqItems, setFaqItems] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_faq_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FAQ_ITEMS;
  });

  const [faqHeader, setFaqHeader] = useState<FAQSectionContent>(() => {
    try {
      const saved = localStorage.getItem('stanbax_faq_header');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FAQ_CONTENT;
  });

  const updateFaqItem = (id: string, itemUpdate: Partial<FAQItem>) => {
    setFaqItems(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, ...itemUpdate } : f);
      try {
        localStorage.setItem('stanbax_faq_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addFaqItem = (newFaq: Omit<FAQItem, 'id'>) => {
    const item: FAQItem = {
      ...newFaq,
      id: `faq-${Date.now()}`,
      order: (newFaq.order !== undefined) ? newFaq.order : faqItems.length + 1
    };
    setFaqItems(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('stanbax_faq_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteFaqItem = (id: string) => {
    setFaqItems(prev => {
      const updated = prev.filter(f => f.id !== id);
      try {
        localStorage.setItem('stanbax_faq_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateFaqHeader = (headerUpdate: Partial<FAQSectionContent>) => {
    setFaqHeader(prev => {
      const updated = { ...prev, ...headerUpdate };
      try {
        localStorage.setItem('stanbax_faq_header', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetFaqToDefault = () => {
    setFaqItems(DEFAULT_FAQ_ITEMS);
    setFaqHeader(DEFAULT_FAQ_CONTENT);
    try {
      localStorage.removeItem('stanbax_faq_items');
      localStorage.removeItem('stanbax_faq_header');
    } catch {}
  };

  // 2B. Proprietress Desk, Profile & Functions (Persistent)
  const [proprietressProfile, setProprietressProfile] = useState<ProprietressProfile>(() => {
    try {
      const saved = localStorage.getItem('stanbax_proprietress_profile');
      if (saved) return { ...DEFAULT_PROPRIETRESS_PROFILE, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_PROPRIETRESS_PROFILE;
  });

  const updateProprietressProfile = (info: Partial<ProprietressProfile>) => {
    setProprietressProfile(prev => {
      const updated = { ...prev, ...info };
      try {
        localStorage.setItem('stanbax_proprietress_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetProprietressProfileToDefault = () => {
    setProprietressProfile(DEFAULT_PROPRIETRESS_PROFILE);
    try {
      localStorage.removeItem('stanbax_proprietress_profile');
    } catch {}
  };

  // Appointments with the Proprietress
  const [appointments, setAppointments] = useState<ProprietressAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_proprietress_appointments');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROPRIETRESS_APPOINTMENTS;
  });

  const bookAppointment = (apptData: Omit<ProprietressAppointment, 'id' | 'refNumber' | 'status' | 'submittedAt'>): string => {
    const refNumber = `STX-EXEC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppt: ProprietressAppointment = {
      ...apptData,
      id: `appt-${Date.now()}`,
      refNumber,
      status: 'Pending Review',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setAppointments(prev => {
      const updated = [newAppt, ...prev];
      try {
        localStorage.setItem('stanbax_proprietress_appointments', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return refNumber;
  };

  const updateAppointmentStatus = (id: string, status: ProprietressAppointment['status'], executiveResponse?: string) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status, ...(executiveResponse !== undefined ? { executiveResponse } : {}) } : a);
      try {
        localStorage.setItem('stanbax_proprietress_appointments', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => {
      const updated = prev.filter(a => a.id !== id);
      try {
        localStorage.setItem('stanbax_proprietress_appointments', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Confidential Messages / Letters to the Proprietress
  const [messagesToProprietress, setMessagesToProprietress] = useState<ProprietressMessage[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_proprietress_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROPRIETRESS_MESSAGES;
  });

  const sendMessageToProprietress = (msgData: Omit<ProprietressMessage, 'id' | 'refNumber' | 'date' | 'status'>): string => {
    const refNumber = `STX-CONF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMsg: ProprietressMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      refNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    setMessagesToProprietress(prev => {
      const updated = [newMsg, ...prev];
      try {
        localStorage.setItem('stanbax_proprietress_messages', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return refNumber;
  };

  const updateProprietressMessageStatus = (id: string, status: ProprietressMessage['status'], note?: string) => {
    setMessagesToProprietress(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, status, ...(note !== undefined ? { proprietressNote: note } : {}) } : m);
      try {
        localStorage.setItem('stanbax_proprietress_messages', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteProprietressMessage = (id: string) => {
    setMessagesToProprietress(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem('stanbax_proprietress_messages', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Executive Directives from the Proprietress Desk
  const [directives, setDirectives] = useState<ProprietressDirective[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_proprietress_directives');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROPRIETRESS_DIRECTIVES;
  });

  const addDirective = (dirData: Omit<ProprietressDirective, 'id'>) => {
    const newDir: ProprietressDirective = {
      ...dirData,
      id: `dir-${Date.now()}`
    };
    setDirectives(prev => {
      const updated = [newDir, ...prev];
      try {
        localStorage.setItem('stanbax_proprietress_directives', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateDirective = (id: string, updatedData: Partial<ProprietressDirective>) => {
    setDirectives(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, ...updatedData } : d);
      try {
        localStorage.setItem('stanbax_proprietress_directives', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteDirective = (id: string) => {
    setDirectives(prev => {
      const updated = prev.filter(d => d.id !== id);
      try {
        localStorage.setItem('stanbax_proprietress_directives', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetDirectivesToDefault = () => {
    setDirectives(DEFAULT_PROPRIETRESS_DIRECTIVES);
    try {
      localStorage.removeItem('stanbax_proprietress_directives');
    } catch {}
  };

  // 3. Faculty Members (Dynamic for landing page)
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_faculty_members');
      if (saved) return JSON.parse(saved);
    } catch {}
    return FACULTY_MEMBERS;
  });

  const addFacultyMember = (memberData: Omit<FacultyMember, 'id'>) => {
    const newMember: FacultyMember = {
      ...memberData,
      id: `fac-${Date.now()}`
    };
    setFacultyList(prev => {
      const updated = [...prev, newMember];
      try {
        localStorage.setItem('stanbax_faculty_members', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateFacultyMember = (id: string, updatedData: Partial<FacultyMember>) => {
    setFacultyList(prev => {
      const updated = prev.map(member => member.id === id ? { ...member, ...updatedData } : member);
      try {
        localStorage.setItem('stanbax_faculty_members', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteFacultyMember = (id: string) => {
    setFacultyList(prev => {
      const updated = prev.filter(member => member.id !== id);
      try {
        localStorage.setItem('stanbax_faculty_members', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetFacultyToDefault = () => {
    setFacultyList(FACULTY_MEMBERS);
    try {
      localStorage.removeItem('stanbax_faculty_members');
    } catch {}
  };

  // 4. Classes & Fees
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_classes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CLASSES;
  });

  const addClass = (clsData: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...clsData,
      id: `cls-${Date.now()}`
    };
    setClasses(prev => {
      const updated = [...prev, newClass];
      try {
        localStorage.setItem('stanbax_classes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Resolve a class catalogue entry from either its id or its display name
  const resolveClassId = (gradeName?: string): string | undefined => {
    const needle = (gradeName || '').trim().toLowerCase();
    if (!needle) return undefined;
    return classes.find(c => (c.name || '').trim().toLowerCase() === needle)?.id
      || classes.find(c => c.id === gradeName)?.id;
  };

  const updateClass = (id: string, updatedData: Partial<SchoolClass>) => {
    const before = classes.find(c => c.id === id);
    setClasses(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updatedData } : c);
      try {
        localStorage.setItem('stanbax_classes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    // Renaming a class propagates the new display name to every record joined
    // by classId (or the legacy name match) so nothing is orphaned.
    if (before && updatedData.name && updatedData.name.trim() && updatedData.name !== before.name) {
      const newName = updatedData.name.trim();
      const oldName = before.name;
      setStudents(prev => {
        const updated = prev.map(s => (s.classId === id || s.grade === oldName)
          ? { ...s, classId: id, grade: newName }
          : s);
        try {
          localStorage.setItem('stanbax_students', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setTimetables(prev => {
        const updated = prev.map(t => t.classId === id ? { ...t, className: newName } : t);
        try {
          localStorage.setItem('stanbax_weekly_timetables', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setAttendanceRecords(prev => {
        const updated = prev.map(r => r.classId === id ? { ...r, className: newName } : r);
        try {
          localStorage.setItem('stanbax_attendance_records', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setHomeworks(prev => {
        const updated = prev.map(hw => (hw.targetClassId === id || hw.targetClass === oldName)
          ? { ...hw, targetClass: newName, targetClassId: id }
          : hw);
        try {
          localStorage.setItem('stanbax_homeworks', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setCbtExams(prev => {
        const updated = prev.map(e => e.targetClassId === id ? { ...e, targetClass: newName } : e);
        try {
          localStorage.setItem('stanbax_cbt_exams', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setLessonNotes(prev => {
        const updated = prev.map(n => (n.targetClass === oldName || n.targetClass === newName)
          ? { ...n, targetClass: newName }
          : n);
        try {
          localStorage.setItem('stanbax_lesson_notes', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const deleteClass = (id: string) => {
    setClasses(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('stanbax_classes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    // Clear the dangling link on enrolled scholars — their `grade` label is
    // preserved so no student data is lost.
    setStudents(prev => {
      const updated = prev.map(s => s.classId === id ? { ...s, classId: undefined } : s);
      try {
        localStorage.setItem('stanbax_students', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetClassesToDefault = () => {
    setClasses(DEFAULT_CLASSES);
    try {
      localStorage.removeItem('stanbax_classes');
    } catch {}
  };

  const assignClassTeacher = (classId: string, tutorId?: string) => {
    const cls = classes.find(c => c.id === classId);
    const previousTutorId = cls?.classTeacherId;
    updateClass(classId, { classTeacherId: tutorId || undefined });
    // Keep TutorProfile.assignedClasses in sync with the class-side assignment
    setTutors(prev => {
      const updated = prev.map(t => {
        const assigned = t.assignedClasses || [];
        if (cls && t.id === tutorId && !assigned.includes(cls.name)) {
          return { ...t, assignedClasses: [...assigned, cls.name] };
        }
        if (cls && t.id === previousTutorId && t.id !== tutorId) {
          return { ...t, assignedClasses: assigned.filter(name => name !== cls.name) };
        }
        return t;
      });
      try {
        localStorage.setItem('stanbax_tutors', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 5. Subjects & Curriculum
  const normalizeSubject = (s: Subject): Subject => ({
    ...s,
    applicableCategories: s.applicableCategories || (s.applicableLevels as any) || ['Senior Secondary'],
    applicableLevels: s.applicableLevels || (s.applicableCategories as any) || ['Senior Secondary'],
    description: s.description || ''
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_subjects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeSubject);
        }
      }
    } catch {}
    return DEFAULT_SUBJECTS.map(normalizeSubject);
  });

  const addSubject = (subjData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = normalizeSubject({
      ...subjData,
      id: `sub-${Date.now()}`
    });
    setSubjects(prev => {
      const updated = [...prev, newSubject];
      try {
        localStorage.setItem('stanbax_subjects', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateSubject = (id: string, updatedData: Partial<Subject>) => {
    setSubjects(prev => {
      const updated = prev.map(s => s.id === id ? normalizeSubject({ ...s, ...updatedData }) : s);
      try {
        localStorage.setItem('stanbax_subjects', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('stanbax_subjects', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetSubjectsToDefault = () => {
    setSubjects(DEFAULT_SUBJECTS.map(normalizeSubject));
    try {
      localStorage.removeItem('stanbax_subjects');
    } catch {}
  };

  // 6. Grading System
  const [gradingSystem, setGradingSystem] = useState<GradeRule[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_grading_system');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_GRADING_SYSTEM;
  });

  const updateGradingRule = (id: string, updatedData: Partial<GradeRule>) => {
    setGradingSystem(prev => {
      const updated = prev.map(rule => rule.id === id ? { ...rule, ...updatedData } : rule);
      try {
        localStorage.setItem('stanbax_grading_system', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addGradingRule = (ruleData: Omit<GradeRule, 'id'>) => {
    const newRule: GradeRule = {
      ...ruleData,
      id: `grd-${Date.now()}`
    };
    setGradingSystem(prev => {
      const updated = [...prev, newRule].sort((a, b) => b.minScore - a.minScore);
      try {
        localStorage.setItem('stanbax_grading_system', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteGradingRule = (id: string) => {
    setGradingSystem(prev => {
      const updated = prev.filter(r => r.id !== id);
      try {
        localStorage.setItem('stanbax_grading_system', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetGradingSystem = () => {
    setGradingSystem(DEFAULT_GRADING_SYSTEM);
    try {
      localStorage.removeItem('stanbax_grading_system');
    } catch {}
  };

  // Grade calculation helper based on dynamic grading system
  const calculateGrade = (totalScore: number): { grade: string; remark: string; color: string } => {
    const rounded = Math.round(totalScore);
    const matched = gradingSystem.find(r => rounded >= r.minScore && rounded <= r.maxScore);
    if (matched) {
      return { grade: matched.grade, remark: matched.remark, color: matched.color };
    }
    // Fallback if none matches exactly
    if (totalScore >= 75) return { grade: 'A1', remark: 'Distinction', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (totalScore >= 70) return { grade: 'B2', remark: 'Very Good', color: 'bg-blue-100 text-blue-900 border-blue-300' };
    if (totalScore >= 65) return { grade: 'B3', remark: 'Good', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' };
    if (totalScore >= 50) return { grade: 'C6', remark: 'Credit', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    if (totalScore >= 40) return { grade: 'E8', remark: 'Pass', color: 'bg-orange-100 text-orange-900 border-orange-300' };
    return { grade: 'F9', remark: 'Fail', color: 'bg-rose-100 text-rose-900 border-rose-300' };
  };

  // 7. Tutors with Subject Assignments
  const [tutors, setTutors] = useState<TutorProfile[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_tutors');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_TUTORS;
  });

  const [activeTutorId, setActiveTutorId] = useState<string>(() => {
    try {
      return localStorage.getItem('stanbax_tutor_id') || sessionStorage.getItem('stanbax_tutor_id') || DEMO_TUTOR.id;
    } catch {
      return DEMO_TUTOR.id;
    }
  });

  const tutor = tutors.find(t => t.id === activeTutorId) || tutors[0] || DEMO_TUTOR;

  const updateTutor = (id: string, updatedData: Partial<TutorProfile>) => {
    if (updatedData.password) {
      void remoteChangePassword(id, null, updatedData.password);
    }
    setTutors(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updatedData } : t);
      try {
        localStorage.setItem('stanbax_tutors', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addTutor = (tutorData: Omit<TutorProfile, 'id'>) => {
    const newTutor: TutorProfile = {
      ...tutorData,
      id: `tut-${Date.now()}`
    };
    setTutors(prev => {
      const updated = [...prev, newTutor];
      try {
        localStorage.setItem('stanbax_tutors', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteTutor = (id: string) => {
    setTutors(prev => {
      const updated = prev.filter(t => t.id !== id);
      try {
        localStorage.setItem('stanbax_tutors', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 8. Manage Notices & Bulletins
  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_notices');
      if (saved) return JSON.parse(saved);
    } catch {}
    return RECENT_NOTICES;
  });

  const updateNotice = (id: string, updatedData: Partial<Notice>) => {
    setNotices(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, ...updatedData } : n);
      try {
        localStorage.setItem('stanbax_notices', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addNotice = (noticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `notice-${Date.now()}`
    };
    setNotices(prev => {
      const updated = [newNotice, ...prev];
      localStorage.setItem('stanbax_notices', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('stanbax_notices', JSON.stringify(updated));
      return updated;
    });
  };

  // 9. Admissions Applications & Entrance Exam Settings
  const DEFAULT_ENTRANCE_EXAM_SETTINGS: EntranceExamSettings = {
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
  };

  const [entranceExamSettings, setEntranceExamSettings] = useState<EntranceExamSettings>(() => {
    try {
      const saved = localStorage.getItem('stanbax_entrance_exam_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ENTRANCE_EXAM_SETTINGS;
  });

  const updateEntranceExamSettings = (settings: Partial<EntranceExamSettings>) => {
    setEntranceExamSettings(prev => {
      const updated = { ...prev, ...settings };
      localStorage.setItem('stanbax_entrance_exam_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetEntranceExamSettings = () => {
    setEntranceExamSettings(DEFAULT_ENTRANCE_EXAM_SETTINGS);
    try {
      localStorage.removeItem('stanbax_entrance_exam_settings');
    } catch {}
  };

  const [applications, setApplications] = useState<AdmissionApplication[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_applications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_APPLICATIONS;
  });

  const submitApplication = (appData: Omit<AdmissionApplication, 'id' | 'refNumber' | 'dateSubmitted' | 'status' | 'screeningDate'>) => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const ref = `STX-${randomSuffix}`;
    const newApp: AdmissionApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      refNumber: ref,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending Review',
      screeningDate: `${entranceExamSettings.examDate}, ${entranceExamSettings.examTime}`,
      screeningTime: entranceExamSettings.examTime,
      screeningVenue: entranceExamSettings.venue,
      examSubjects: entranceExamSettings.subjects,
      examRequirements: entranceExamSettings.requirements.join(' • ')
    };
    setApplications(prev => {
      const updated = [newApp, ...prev];
      localStorage.setItem('stanbax_applications', JSON.stringify(updated));
      return updated;
    });
    void remoteSubmitAdmissionApplication(newApp);
    return ref;
  };

  const updateApplicationStatus = (id: string, status: AdmissionApplication['status'], screeningDate?: string) => {
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            status,
            screeningDate: screeningDate || app.screeningDate
          };
        }
        return app;
      });
      localStorage.setItem('stanbax_applications', JSON.stringify(updated));
      return updated;
    });
  };

  const updateApplicationExamDetails = (id: string, details: Partial<AdmissionApplication>) => {
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            ...details
          };
        }
        return app;
      });
      localStorage.setItem('stanbax_applications', JSON.stringify(updated));
      return updated;
    });
  };

  // 9b. Parent Broadcast Logs
  const [broadcastLogs, setBroadcastLogs] = useState<ParentBroadcastLog[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_broadcast_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BROADCAST_LOGS;
  });

  const addBroadcastLog = (logData: Omit<ParentBroadcastLog, 'id' | 'dateSent'>) => {
    const newLog: ParentBroadcastLog = {
      ...logData,
      id: `blog-${Date.now()}`,
      dateSent: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setBroadcastLogs(prev => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('stanbax_broadcast_logs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Helper to determine next class on promotion — always returns a real class name
  // (or the sentinel 'Graduated / Alumni' for terminal classes).
  const getNextClass = (currentGrade: string): string => {
    const clean = (currentGrade || '').trim();
    if (/SSS 3|Senior Secondary 3|Grade 12/i.test(clean)) return 'Graduated / Alumni';
    if (/JSS 3|Junior Secondary 3|Basic 9/i.test(clean)) return 'SSS 1 Science';
    if (/Primary 6|Basic 6|Grade 6/i.test(clean)) return 'JSS 1';
    if (/Nursery 2|KG 2/i.test(clean)) return 'Primary 1';
    if (/Creche|Playgroup/i.test(clean)) return 'Nursery 1';
    const numMatch = clean.match(/(\d+)/);
    if (numMatch) {
      return clean.replace(numMatch[1], String(Number(numMatch[1]) + 1));
    }
    return `${clean} (Advanced)`;
  };

  // 10. Students & Homework
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const normalize = (s: StudentProfile): StudentProfile => {
      // Backfill classId from the grade label for records saved before the
      // id migration, and keep the displayed grade synced to the class name
      // so a class rename flows through to the scholar's profile.
      const classId = s.classId || resolveClassId(s.grade);
      const cls = classId ? classes.find(c => c.id === classId) : undefined;
      return {
        ...s,
        classId: classId || s.classId,
        grade: cls ? cls.name : s.grade,
        academicHistory: (s.academicHistory && s.academicHistory.length > 0)
          ? s.academicHistory
          : generateStudentHistoricalRecords(s)
      };
    };
    try {
      const saved = localStorage.getItem('stanbax_students');
      if (saved) {
        const parsed: StudentProfile[] = JSON.parse(saved);
        let normalized = parsed.map(normalize);
        // One-time migration: the legacy shared gradebook ('stanbax_grades')
        // becomes the per-scholar record of the account it belonged to.
        try {
          const legacyRaw = localStorage.getItem('stanbax_grades');
          if (legacyRaw) {
            const legacy = JSON.parse(legacyRaw) as GradeRecord[];
            const ownerId = sessionStorage.getItem('stanbax_student_id') || 'stu-1';
            if (Array.isArray(legacy) && legacy.length > 0) {
              normalized = normalized.map(s =>
                s.id === ownerId && (!s.grades || s.grades.length === 0)
                  ? { ...s, grades: legacy }
                  : s
              );
            }
            localStorage.removeItem('stanbax_grades');
          }
        } catch {}
        return normalized;
      }
    } catch {}
    return DEMO_STUDENTS.map(normalize);
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    try {
      return localStorage.getItem('stanbax_student_id') || sessionStorage.getItem('stanbax_student_id') || DEMO_STUDENT.id;
    } catch {
      return DEMO_STUDENT.id;
    }
  });

  const student = students.find(s => s.id === activeStudentId) || students[0] || DEMO_STUDENT;

  const switchActiveStudent = (id: string) => {
    setActiveStudentId(id);
  };

  const updateStudent = (id: string, updatedData: Partial<StudentProfile>) => {
    if (updatedData.password) {
      void remoteChangePassword(id, null, updatedData.password);
    }
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id !== id) return s;
        const next = { ...s, ...updatedData };
        // Keep the join key in step when a grade label is edited directly
        if (updatedData.grade !== undefined && updatedData.classId === undefined) {
          next.classId = resolveClassId(updatedData.grade) || s.classId;
        }
        return next;
      });
      try {
        localStorage.setItem('stanbax_students', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const registerStudent = (data: StudentRegistrationData): StudentProfile => {
    const currentYear = new Date().getFullYear();
    const existingNums = students
      .map(s => {
        const match = s.regNumber.match(/\/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const nextNum = (existingNums.length > 0 ? Math.max(...existingNums) : 100) + 1;
    const formattedNum = String(nextNum).padStart(3, '0');
    const regNumber = `STX/${currentYear}/${formattedNum}`;

    const newStudent: StudentProfile = {
      id: `std-${Date.now()}`,
      name: data.name.trim(),
      regNumber,
      grade: data.grade,
      classId: data.classId || resolveClassId(data.grade),
      gender: data.gender || 'Male',
      parentName: data.parentName || 'Guardian',
      parentPhone: data.parentPhone || '+234 800 000 0000',
      house: data.house,
      attendancePercent: 0,
      attendanceDays: 0,
      totalSchoolDays: 0,
      termAverage: 0,
      emergencyPhone: data.emergencyPhone?.trim() || '+234 803 000 0000',
      clubs: [],
      email: data.email?.trim() || `${data.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@stanbaxschools.edu.ng`,
      password: data.password?.trim() || 'stanbax2025',
      securityQuestion: data.securityQuestion?.trim() || '',
      securityAnswer: data.securityAnswer?.trim() || '',
      passportPhoto: data.passportPhoto || '',
      isAlumni: false,
      feeTotal: classes.find(c => c.id === (data.classId || '') || c.name === data.grade)?.tuitionPerTerm,
      feePaid: 0,
      feeStatus: 'Outstanding',
      promotionStatus: 'Pending',
      academicHistory: []
    };

    newStudent.academicHistory = generateStudentHistoricalRecords(newStudent);
    if (newStudent.feeTotal) {
      newStudent.feeBalance = newStudent.feeTotal;
    }

    setStudents(prev => {
      const updated = [newStudent, ...prev];
      try {
        localStorage.setItem('stanbax_students', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not persist student list to localStorage', err);
      }
      return updated;
    });

    void remoteRegisterStudentCredential(
      regNumber,
      newStudent.password || 'stanbax2025',
      newStudent.id,
      [newStudent.email, newStudent.name.toLowerCase()].filter((x): x is string => Boolean(x))
    );

    return newStudent;
  };

  const updateStudentPassport = (studentId: string, passportPhoto: string) => {
    updateStudent(studentId, { passportPhoto });
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('stanbax_students', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_homeworks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_HOMEWORKS;
  });

  // Homework completion is tracked per scholar via submissions[studentId];
  // `status` remains the default/class-level state for tutors' dashboards.
  const toggleHomeworkStatus = (id: string, studentId?: string) => {
    const targetId = studentId || activeStudentId;
    setHomeworks(prev => {
      const updated = prev.map(hw => {
        if (hw.id !== id) return hw;
        const submissions = { ...(hw.submissions || {}) };
        const current = submissions[targetId] ?? hw.status;
        if (current === 'Graded') return hw;
        submissions[targetId] = current === 'Submitted' ? 'Pending' : 'Submitted';
        return { ...hw, submissions };
      });
      try {
        localStorage.setItem('stanbax_homeworks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addHomework = (hwData: Omit<Homework, 'id' | 'status'>) => {
    const newHw: Homework = {
      ...hwData,
      id: `hw-${Date.now()}`,
      status: 'Pending'
    };
    setHomeworks(prev => {
      const updated = [newHw, ...prev];
      localStorage.setItem('stanbax_homeworks', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteHomework = (id: string) => {
    setHomeworks(prev => {
      const updated = prev.filter(hw => hw.id !== id);
      try {
        localStorage.setItem('stanbax_homeworks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 11. Grades & Assessment Collation Engine
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentControlConfig>(() => {
    try {
      const saved = localStorage.getItem('stanbax_assessment_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new weights (ca1: 10, ca2: 10, ca3: 10, exam: 70) take effect even if older 20/50 config was saved in browser localStorage
        if (parsed.ca1Max === 20 || parsed.examMax === 50 || !parsed.ca1Max) {
          return {
            ...parsed,
            ca1Max: 10,
            ca2Max: 10,
            ca3Max: 10,
            examMax: 70
          };
        }
        return { ...DEFAULT_ASSESSMENT_CONFIG, ...parsed };
      }
    } catch {}
    return DEFAULT_ASSESSMENT_CONFIG;
  });

  const updateAssessmentConfig = (config: Partial<AssessmentControlConfig>) => {
    setAssessmentConfig(prev => {
      const updated = { ...prev, ...config };
      try {
        localStorage.setItem('stanbax_assessment_config', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const setActiveAssessmentPhase = (phase: AssessmentEntryPhase) => {
    updateAssessmentConfig({ activePhase: phase });
  };

  const setActiveAssessmentTerm = (term: '1st Term' | '2nd Term' | '3rd Term') => {
    updateAssessmentConfig({ activeTerm: term });
    // Also keep schoolInfo activeTerm aligned
    const mapped = term === '1st Term' 
      ? '1st Term (Michaelmas Term)' 
      : term === '2nd Term' 
      ? '2nd Term (Lent Term)' 
      : '3rd Term (Trinity Term)';
    updateSchoolInfo({ activeTerm: mapped });
  };

  const setPromotionPassMark = (percent: number) => {
    updateAssessmentConfig({ promotionPassMarkPercent: percent });
  };

  const resetAssessmentToDefault = () => {
    setAssessmentConfig(DEFAULT_ASSESSMENT_CONFIG);
    try {
      localStorage.removeItem('stanbax_assessment_config');
    } catch {}
  };

  // Per-scholar gradebooks are stored on each StudentProfile.grades; this
  // derived value exposes the active scholar's records for report-card views.
  const grades = student.grades || [];

  const getStudentGrades = (studentId: string): GradeRecord[] => {
    return students.find(s => s.id === studentId)?.grades || [];
  };

  const updateGrade = (
    subject: string, 
    ca1: number, 
    ca2: number, 
    exam: number, 
    ca3 = 0,
    studentId?: string
  ) => {
    // Total is calculated across CA1 (10) + CA2 (10) + CA3 (10) + Exam (70) = 100
    const total = ca1 + ca2 + ca3 + exam;
    const { grade, remark } = calculateGrade(total);
    const targetId = studentId || activeStudentId;
    const activeTerm = assessmentConfig.activeTerm;

    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id !== targetId) return s;
        const existing = s.grades || [];
        const idx = existing.findIndex(g => g.subject.toLowerCase() === subject.toLowerCase());

        let nextGrades: GradeRecord[];
        if (idx >= 0) {
          nextGrades = existing.map((g, i) => {
            if (i !== idx) return g;
            const t1 = activeTerm === '1st Term' ? total : g.term1Total;
            const t2 = activeTerm === '2nd Term' ? total : g.term2Total;
            const t3 = activeTerm === '3rd Term' ? total : g.term3Total;
            const knownTerms = [t1, t2, t3].filter((v): v is number => typeof v === 'number');
            const annualAvg = knownTerms.length > 0
              ? Math.round((knownTerms.reduce((a, b) => a + b, 0) / knownTerms.length) * 10) / 10
              : total;
            return {
              ...g,
              ca1,
              ca2,
              ca3,
              exam,
              total,
              grade,
              remark,
              term1Total: t1,
              term2Total: t2,
              term3Total: t3,
              annualAverage: annualAvg
            };
          });
        } else {
          const record: GradeRecord = {
            id: `grd-${targetId}-${subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            subject,
            ca1,
            ca2,
            ca3,
            exam,
            total,
            grade,
            remark,
            annualAverage: total
          };
          if (activeTerm === '1st Term') record.term1Total = total;
          else if (activeTerm === '2nd Term') record.term2Total = total;
          else if (activeTerm === '3rd Term') record.term3Total = total;
          nextGrades = [...existing, record];
        }

        const avg = Math.round(nextGrades.reduce((sum, g) => sum + g.total, 0) / (nextGrades.length || 1) * 10) / 10;
        const annualAvg = Math.round(nextGrades.reduce((sum, g) => sum + (g.annualAverage ?? g.total), 0) / (nextGrades.length || 1) * 10) / 10;

        return {
          ...s,
          grades: nextGrades,
          termAverage: avg,
          cumulativeAnnualAverage: annualAvg,
          ...(activeTerm === '1st Term' ? { term1Average: avg } : {}),
          ...(activeTerm === '2nd Term' ? { term2Average: avg } : {}),
          ...(activeTerm === '3rd Term' ? { term3Average: avg } : {})
        };
      });
      try {
        localStorage.setItem('stanbax_students', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Roll over session and automatically upgrade scholars who passed the set percentage
  const startNewAcademicSession = (newSessionName: string, passMarkPercentage = assessmentConfig.promotionPassMarkPercent) => {
    const upgradedStudents: Array<{
      id: string;
      name: string;
      oldClass: string;
      newClass: string;
      passed: boolean;
      average: number;
    }> = [];

    let promotedCount = 0;
    let repeatedCount = 0;

    const nextStudents = students.map(s => {
      // Use 3rd term cumulative annual average or current average
      const scoreToUse = s.cumulativeAnnualAverage ?? s.termAverage;
      const isPassed = scoreToUse >= passMarkPercentage;
      const targetNextClass = isPassed ? getNextClass(s.grade) : s.grade;
      const targetNextClassId = isPassed ? (resolveClassId(targetNextClass) || s.classId) : s.classId;
      const isGraduating = isPassed && targetNextClass === 'Graduated / Alumni';
      const scholarGrades = s.grades || [];

      if (isPassed) {
        promotedCount++;
      } else {
        repeatedCount++;
      }

      upgradedStudents.push({
        id: s.id,
        name: s.name,
        oldClass: s.grade,
        newClass: targetNextClass,
        passed: isPassed,
        average: scoreToUse
      });

      // Archive completed session into academicHistory
      const sessionArchive: HistoricalSessionRecord = {
        id: `session-${Date.now()}-${s.id}`,
        sessionName: schoolInfo.activeSession,
        classEnrolled: s.grade,
        annualAverage: scoreToUse,
        promotionStatus: isPassed ? 'Promoted' : 'Repeat',
        promotedToGrade: targetNextClass,
        terms: {
          '1st Term': {
            term: '1st Term',
            termFullName: '1st Term (Michaelmas Term)',
            termAverage: s.term1Average ?? scoreToUse,
            attendanceDays: 58,
            totalSchoolDays: 60,
            classEnrolled: s.grade,
            teacherRemark: 'Commendable attendance and active classroom participation.',
            principalRemark: 'Good progress maintained.',
            grades: scholarGrades.map(g => {
              const tot = g.term1Total ?? g.total;
              const ca1 = Math.min(10, Math.round(tot * 0.1));
              const ca2 = Math.min(10, Math.round(tot * 0.1));
              const ca3 = Math.min(10, Math.round(tot * 0.1));
              const exam = tot - ca1 - ca2 - ca3;
              return {
                ...g,
                total: tot,
                exam,
                ca1,
                ca2,
                ca3
              };
            })
          },
          '2nd Term': {
            term: '2nd Term',
            termFullName: '2nd Term (Lent Term)',
            termAverage: s.term2Average ?? scoreToUse,
            attendanceDays: 59,
            totalSchoolDays: 60,
            classEnrolled: s.grade,
            teacherRemark: 'Steady advancement in continuous assessments and group assignments.',
            principalRemark: 'Satisfactory standard sustained.',
            grades: scholarGrades.map(g => {
              const tot = g.term2Total ?? g.total;
              const ca1 = Math.min(10, Math.round(tot * 0.1));
              const ca2 = Math.min(10, Math.round(tot * 0.1));
              const ca3 = Math.min(10, Math.round(tot * 0.1));
              const exam = tot - ca1 - ca2 - ca3;
              return {
                ...g,
                total: tot,
                exam,
                ca1,
                ca2,
                ca3
              };
            })
          },
          '3rd Term': {
            term: '3rd Term',
            termFullName: '3rd Term (Trinity Term)',
            termAverage: s.term3Average ?? s.termAverage,
            attendanceDays: 58,
            totalSchoolDays: 59,
            classEnrolled: s.grade,
            teacherRemark: 'Demonstrated admirable commitment throughout the final term.',
            principalRemark: isPassed ? `Promoted to ${targetNextClass}.` : 'Repeat recommended to solidify foundation.',
            grades: [...scholarGrades]
          }
        }
      };

      const existingHistory = s.academicHistory || generateStudentHistoricalRecords(s);
      const updatedHistory = [sessionArchive, ...existingHistory.filter(h => h.sessionName !== schoolInfo.activeSession)];

      return {
        ...s,
        grade: targetNextClass,
        classId: targetNextClassId,
        isAlumni: isGraduating ? true : s.isAlumni,
        graduationSession: isGraduating ? schoolInfo.activeSession : s.graduationSession,
        promotionStatus: isPassed ? ('Promoted' as const) : ('Repeat' as const),
        promotedToGrade: targetNextClass,
        academicHistory: updatedHistory,
        term1Average: undefined,
        term2Average: undefined,
        term3Average: undefined,
        cumulativeAnnualAverage: undefined
      };
    });

    // Save updated students
    setStudents(nextStudents);
    try {
      localStorage.setItem('stanbax_students', JSON.stringify(nextStudents));
    } catch {}

    // Update session info
    const oldSession = schoolInfo.activeSession;
    updateSchoolInfo({
      activeSession: newSessionName,
      activeTerm: '1st Term (Michaelmas Term)'
    });

    // Update assessment config: Reset to 1st Term and open mid_term_ca for new session
    const updatedHistory = [
      {
        id: `promo-${Date.now()}`,
        fromSession: oldSession,
        toSession: newSessionName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        totalEvaluated: students.length,
        promotedCount,
        repeatedCount,
        passPercentageUsed: passMarkPercentage
      },
      ...(assessmentConfig.promotionHistory || [])
    ];

    updateAssessmentConfig({
      activeSession: newSessionName,
      activeTerm: '1st Term',
      activePhase: 'mid_term_ca',
      lastPromotionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      promotionHistory: updatedHistory
    });

    return {
      promotedCount,
      repeatedCount,
      upgradedStudents
    };
  };

  const toggleAutoRanking = (enabled?: boolean) => {
    updateAssessmentConfig({
      autoRankingEnabled: enabled !== undefined ? enabled : !assessmentConfig.autoRankingEnabled
    });
  };

  const getClassRankings = (classNameOrId: string, term?: string) => {
    // Accept a class id or a class name
    const cls = classes.find(c => c.id === classNameOrId)
      || classes.find(c => (c.name || '').trim().toLowerCase() === (classNameOrId || '').trim().toLowerCase());
    const classStudents = students.filter(s => {
      if (s.isAlumni) return false;
      if (cls && s.classId === cls.id) return true;
      const sGrade = (s.grade || '').trim().toLowerCase();
      const target = (cls?.name || classNameOrId || '').trim().toLowerCase();
      if (!sGrade || !target) return false;
      return sGrade === target || sGrade.includes(target) || target.includes(sGrade);
    });

    // Determine student score/average
    const scoredStudents = classStudents.map(student => {
      let avg = student.cumulativeAnnualAverage ?? student.termAverage ?? 0;
      if (term === '1st Term' && student.term1Average !== undefined) {
        avg = student.term1Average;
      } else if (term === '2nd Term' && student.term2Average !== undefined) {
        avg = student.term2Average;
      } else if (term === '3rd Term' && (student.term3Average !== undefined || student.cumulativeAnnualAverage !== undefined)) {
        avg = student.term3Average ?? student.cumulativeAnnualAverage ?? 0;
      }
      return {
        student,
        average: Math.round(avg * 10) / 10,
        totalScore: Math.round(avg * 10) / 10
      };
    });

    // Sort descending by average
    scoredStudents.sort((a, b) => b.average - a.average);

    // Assign positions/ranks (1st, 2nd, 3rd...)
    return scoredStudents.map((item, idx) => {
      const rank = idx + 1;
      const suffix = (r: number) => {
        const j = r % 10, k = r % 100;
        if (j === 1 && k !== 11) return `${r}st`;
        if (j === 2 && k !== 12) return `${r}nd`;
        if (j === 3 && k !== 13) return `${r}rd`;
        return `${r}th`;
      };
      return {
        ...item,
        rank,
        positionText: suffix(rank)
      };
    });
  };

  // 12. Contact Inquiries
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_inquiries');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "inq-1",
        fullName: "Mr. Adebayo Adeleke",
        email: "ade.adeleke@yahoo.com",
        subject: "Inquiry on Creche & After-School Care",
        message: "Good day, I would like to confirm if your creche takes 14-month-old toddlers and the closing pick-up hour for working parents.",
        date: "2026-09-16",
        status: "New"
      }
    ];
  });

  const submitInquiry = (fullName: string, email: string, subject: string, message: string) => {
    const newInquiry: ContactInquiry = {
      id: `inq-${Date.now()}`,
      fullName,
      email,
      subject,
      message,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    setInquiries(prev => {
      const updated = [newInquiry, ...prev];
      try {
        localStorage.setItem('stanbax_inquiries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    void remoteSubmitContactInquiry(newInquiry);
  };

  // 13. Unified Authentication (Admin, Proprietress, Faculty/Tutor, Scholar/Parent)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stanbax_admin_auth') === 'true' || sessionStorage.getItem('stanbax_admin_auth') === 'true';
    } catch { return false; }
  });

  const [isProprietressAuthenticated, setIsProprietressAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stanbax_proprietress_auth') === 'true' || sessionStorage.getItem('stanbax_proprietress_auth') === 'true';
    } catch { return false; }
  });

  const [isTutorAuthenticated, setIsTutorAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stanbax_tutor_auth') === 'true' || sessionStorage.getItem('stanbax_tutor_auth') === 'true';
    } catch { return false; }
  });

  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stanbax_student_auth') === 'true' || sessionStorage.getItem('stanbax_student_auth') === 'true';
    } catch { return false; }
  });

  // Default credentials come from Vite env vars injected at build time
  // (GitHub Secrets) so they are never committed to the source tree.
  const DEFAULT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Justin2000.';
  const DEFAULT_PROPRIETRESS_PASSWORD = import.meta.env.VITE_PROPRIETRESS_PASSWORD || 'Proprietress2025!';

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    const saved = localStorage.getItem('stanbax_admin_password');
    if (!saved || saved === 'Admin2025!' || saved === 'stanbax2025') {
      localStorage.setItem('stanbax_admin_password', DEFAULT_ADMIN_PASSWORD);
      return DEFAULT_ADMIN_PASSWORD;
    }
    return saved;
  });

  const [adminSecurityQuestion, setAdminSecurityQuestion] = useState<string>(() => {
    return localStorage.getItem('stanbax_admin_security_q') || 'What is the name of your first school';
  });

  const [adminSecurityAnswer, setAdminSecurityAnswer] = useState<string>(() => {
    return localStorage.getItem('stanbax_admin_security_a') || 'Stanbax';
  });

  const updateAdminSecurityQuestion = (question: string, answer: string) => {
    const q = question.trim();
    const a = answer.trim();
    if (!q) return { success: false, message: 'Security question cannot be empty.' };
    if (!a) return { success: false, message: 'Security answer cannot be empty.' };
    setAdminSecurityQuestion(q);
    setAdminSecurityAnswer(a);
    localStorage.setItem('stanbax_admin_security_q', q);
    localStorage.setItem('stanbax_admin_security_a', a);
    return { success: true, message: 'Administrator security question successfully updated.' };
  };

  const [proprietressPassword, setProprietressPassword] = useState<string>(() => {
    return localStorage.getItem('stanbax_proprietress_password') || DEFAULT_PROPRIETRESS_PASSWORD;
  });

  const isAdminPasswordValid = (pass: string) => {
    const clean = pass.trim();
    return clean === adminPassword;
  };

  const isProprietressPasswordValid = (pass: string) => {
    const clean = pass.trim();
    return clean === proprietressPassword;
  };

  const [isParentAuthenticated, setIsParentAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stanbax_parent_auth') === 'true' || sessionStorage.getItem('stanbax_parent_auth') === 'true';
    } catch { return false; }
  });
  const [activeParentId, setActiveParentId] = useState<string>(() => {
    try {
      return localStorage.getItem('stanbax_parent_id') || sessionStorage.getItem('stanbax_parent_id') || (DEFAULT_PARENTS[0]?.id || 'parent-1');
    } catch { return DEFAULT_PARENTS[0]?.id || 'parent-1'; }
  });

  // Head Mistress Desk & Credentials
  const DEFAULT_HEADMISTRESS_PASSWORD = 'Headmistress2025!';
  const [headmistressPassword, setHeadmistressPassword] = useState<string>(() => {
    return localStorage.getItem('stanbax_headmistress_password') || DEFAULT_HEADMISTRESS_PASSWORD;
  });
  const [headmistressProfile, setHeadmistressProfile] = useState<HeadmistressProfile>(() => {
    try {
      const saved = localStorage.getItem('stanbax_headmistress_profile');
      if (saved) return { ...DEFAULT_HEADMISTRESS_PROFILE, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_HEADMISTRESS_PROFILE;
  });
  const updateHeadmistressProfile = (info: Partial<HeadmistressProfile>) => {
    setHeadmistressProfile(prev => {
      const updated = { ...prev, ...info };
      try { localStorage.setItem('stanbax_headmistress_profile', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };
  const [isHeadmistressAuthenticated, setIsHeadmistressAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stanbax_headmistress_auth') === 'true' || sessionStorage.getItem('stanbax_headmistress_auth') === 'true';
    } catch { return false; }
  });

  // Moderator Desk & Credentials
  const DEFAULT_MODERATOR_PASSWORD = 'Moderator2025!';
  const [moderatorPassword, setModeratorPassword] = useState<string>(() => {
    return localStorage.getItem('stanbax_moderator_password') || DEFAULT_MODERATOR_PASSWORD;
  });
  const [moderators, setModerators] = useState<ModeratorProfile[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_moderators');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MODERATORS;
  });
  const addModerator = (data: Omit<ModeratorProfile, 'id'>): ModeratorProfile => {
    const newMod: ModeratorProfile = {
      id: `mod-${Date.now()}`,
      ...data
    };
    setModerators(prev => {
      const updated = [...prev, newMod];
      try { localStorage.setItem('stanbax_moderators', JSON.stringify(updated)); } catch {}
      return updated;
    });
    return newMod;
  };
  const updateModerator = (id: string, data: Partial<ModeratorProfile>) => {
    setModerators(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, ...data } : m);
      try { localStorage.setItem('stanbax_moderators', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };
  const deleteModerator = (id: string) => {
    setModerators(prev => {
      const updated = prev.filter(m => m.id !== id);
      try { localStorage.setItem('stanbax_moderators', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };
  const [isModeratorAuthenticated, setIsModeratorAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stanbax_moderator_auth') === 'true' || sessionStorage.getItem('stanbax_moderator_auth') === 'true';
    } catch { return false; }
  });
  const [activeModeratorId, setActiveModeratorId] = useState<string>(() => {
    try {
      return localStorage.getItem('stanbax_moderator_id') || sessionStorage.getItem('stanbax_moderator_id') || 'mod-1';
    } catch { return 'mod-1'; }
  });

  // Role Delegated Privileges System (Admin configurable)
  const [rolePrivileges, setRolePrivileges] = useState<RolePrivilegeSettings>(() => {
    try {
      const saved = localStorage.getItem('stanbax_role_privileges');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          headmistress: { ...DEFAULT_ROLE_PRIVILEGES.headmistress, ...(parsed.headmistress || {}) },
          moderator: { ...DEFAULT_ROLE_PRIVILEGES.moderator, ...(parsed.moderator || {}) },
          tutor: { ...DEFAULT_ROLE_PRIVILEGES.tutor, ...(parsed.tutor || {}) },
          student: { ...DEFAULT_ROLE_PRIVILEGES.student, ...(parsed.student || {}) },
          parent: { ...DEFAULT_ROLE_PRIVILEGES.parent, ...(parsed.parent || {}) }
        };
      }
    } catch {}
    return DEFAULT_ROLE_PRIVILEGES;
  });

  const updateRolePrivilege = (
    role: 'headmistress' | 'moderator' | 'tutor' | 'student' | 'parent',
    key: PrivilegeKey,
    granted: boolean
  ) => {
    setRolePrivileges(prev => {
      const updated = {
        ...prev,
        [role]: {
          ...prev[role],
          [key]: granted
        }
      };
      try {
        localStorage.setItem('stanbax_role_privileges', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetRolePrivileges = (targetRole?: 'headmistress' | 'moderator' | 'tutor') => {
    setRolePrivileges(prev => {
      let updated: RolePrivilegeSettings;
      if (targetRole) {
        updated = {
          ...prev,
          [targetRole]: { ...DEFAULT_ROLE_PRIVILEGES[targetRole] }
        };
      } else {
        updated = { ...DEFAULT_ROLE_PRIVILEGES };
      }
      try {
        localStorage.setItem('stanbax_role_privileges', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const hasPrivilege = (role: UserRole, key: PrivilegeKey): boolean => {
    if (role === 'admin' || role === 'proprietress') return true;
    if (role === 'headmistress') return !!rolePrivileges.headmistress[key];
    if (role === 'moderator') return !!rolePrivileges.moderator[key];
    if (role === 'tutor') return !!rolePrivileges.tutor[key];
    if (role === 'student') return !!rolePrivileges.student[key];
    if (role === 'parent') return !!rolePrivileges.parent[key];
    return false;
  };

  const authenticatedRole: UserRole | null = isAdminAuthenticated
    ? 'admin'
    : isProprietressAuthenticated
    ? 'proprietress'
    : isHeadmistressAuthenticated
    ? 'headmistress'
    : isModeratorAuthenticated
    ? 'moderator'
    : isTutorAuthenticated
    ? 'tutor'
    : isStudentAuthenticated
    ? 'student'
    : isParentAuthenticated
    ? 'parent'
    : null;

  const clearOtherRoles = (keep: UserRole) => {
    if (keep !== 'admin') {
      setIsAdminAuthenticated(false);
      localStorage.removeItem('stanbax_admin_auth');
      sessionStorage.removeItem('stanbax_admin_auth');
    }
    if (keep !== 'proprietress') {
      setIsProprietressAuthenticated(false);
      localStorage.removeItem('stanbax_proprietress_auth');
      sessionStorage.removeItem('stanbax_proprietress_auth');
    }
    if (keep !== 'headmistress') {
      setIsHeadmistressAuthenticated(false);
      localStorage.removeItem('stanbax_headmistress_auth');
      sessionStorage.removeItem('stanbax_headmistress_auth');
    }
    if (keep !== 'moderator') {
      setIsModeratorAuthenticated(false);
      localStorage.removeItem('stanbax_moderator_auth');
      localStorage.removeItem('stanbax_moderator_id');
      sessionStorage.removeItem('stanbax_moderator_auth');
      sessionStorage.removeItem('stanbax_moderator_id');
    }
    if (keep !== 'tutor') {
      setIsTutorAuthenticated(false);
      localStorage.removeItem('stanbax_tutor_auth');
      localStorage.removeItem('stanbax_tutor_id');
      sessionStorage.removeItem('stanbax_tutor_auth');
      sessionStorage.removeItem('stanbax_tutor_id');
    }
    if (keep !== 'student') {
      setIsStudentAuthenticated(false);
      localStorage.removeItem('stanbax_student_auth');
      localStorage.removeItem('stanbax_student_id');
      sessionStorage.removeItem('stanbax_student_auth');
      sessionStorage.removeItem('stanbax_student_id');
    }
    if (keep !== 'parent') {
      setIsParentAuthenticated(false);
      localStorage.removeItem('stanbax_parent_auth');
      localStorage.removeItem('stanbax_parent_id');
      sessionStorage.removeItem('stanbax_parent_auth');
      sessionStorage.removeItem('stanbax_parent_id');
    }
  };

  // Universal Single Sign-On Gateway (Automatically detects user role & redirects)
  const universalLogin = async (identifier: string, pass: string): Promise<{
    success: boolean;
    role?: UserRole;
    message?: string;
    targetSection?: PageSection;
    isAlumni?: boolean;
  }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter both your identifier and password.' };
    }

    // Server-verified auth: when Supabase is configured and reachable the
    // database is the source of truth (passwords are hashed, checked via RPC).
    if (isRemoteEnabled()) {
      const res = await remoteVerifyLogin(cleanId, cleanPass);
      if (!res.unreachable) {
        if (!res.ok) {
          return { success: false, message: res.message || 'Invalid credentials.' };
        }
        const role = res.role as UserRole;
        clearOtherRoles(role);
        const sectionByRole: Record<UserRole, PageSection> = {
          admin: 'admin-portal',
          proprietress: 'proprietress-portal',
          headmistress: 'headmistress-portal',
          moderator: 'moderator-portal',
          tutor: 'tutor-portal',
          student: 'student-portal',
          parent: 'parent-portal',
        };
        const matchedStudent = res.refId ? students.find(s => s.id === res.refId) : undefined;
        switch (role) {
          case 'admin':
            setIsAdminAuthenticated(true);
            localStorage.setItem('stanbax_admin_auth', 'true');
            sessionStorage.setItem('stanbax_admin_auth', 'true');
            localStorage.setItem('stanbax_active_section', 'admin-portal');
            sessionStorage.setItem('stanbax_active_section', 'admin-portal');
            break;
          case 'proprietress':
            setIsProprietressAuthenticated(true);
            localStorage.setItem('stanbax_proprietress_auth', 'true');
            sessionStorage.setItem('stanbax_proprietress_auth', 'true');
            localStorage.setItem('stanbax_active_section', 'proprietress-portal');
            sessionStorage.setItem('stanbax_active_section', 'proprietress-portal');
            break;
          case 'headmistress':
            setIsHeadmistressAuthenticated(true);
            localStorage.setItem('stanbax_headmistress_auth', 'true');
            sessionStorage.setItem('stanbax_headmistress_auth', 'true');
            localStorage.setItem('stanbax_active_section', 'headmistress-portal');
            sessionStorage.setItem('stanbax_active_section', 'headmistress-portal');
            break;
          case 'moderator':
            setIsModeratorAuthenticated(true);
            if (res.refId) {
              setActiveModeratorId(res.refId);
              localStorage.setItem('stanbax_moderator_id', res.refId);
              sessionStorage.setItem('stanbax_moderator_id', res.refId);
            }
            localStorage.setItem('stanbax_moderator_auth', 'true');
            sessionStorage.setItem('stanbax_moderator_auth', 'true');
            localStorage.setItem('stanbax_active_section', 'moderator-portal');
            sessionStorage.setItem('stanbax_active_section', 'moderator-portal');
            break;
          case 'tutor':
            setIsTutorAuthenticated(true);
            if (res.refId) {
              setActiveTutorId(res.refId);
              localStorage.setItem('stanbax_tutor_id', res.refId);
              sessionStorage.setItem('stanbax_tutor_id', res.refId);
            }
            localStorage.setItem('stanbax_tutor_auth', 'true');
            sessionStorage.setItem('stanbax_tutor_auth', 'true');
            localStorage.setItem('stanbax_active_section', 'tutor-portal');
            sessionStorage.setItem('stanbax_active_section', 'tutor-portal');
            break;
          case 'student':
            setIsStudentAuthenticated(true);
            if (res.refId) {
              setActiveStudentId(res.refId);
              localStorage.setItem('stanbax_student_id', res.refId);
              sessionStorage.setItem('stanbax_student_id', res.refId);
            }
            localStorage.setItem('stanbax_student_auth', 'true');
            sessionStorage.setItem('stanbax_student_auth', 'true');
            localStorage.setItem('stanbax_active_section', 'student-portal');
            sessionStorage.setItem('stanbax_active_section', 'student-portal');
            break;
          case 'parent':
            setIsParentAuthenticated(true);
            if (res.refId) {
              setActiveParentId(res.refId);
              localStorage.setItem('stanbax_parent_id', res.refId);
              sessionStorage.setItem('stanbax_parent_id', res.refId);
            }
            localStorage.setItem('stanbax_parent_auth', 'true');
            sessionStorage.setItem('stanbax_parent_auth', 'true');
            localStorage.setItem('stanbax_active_section', 'parent-portal');
            sessionStorage.setItem('stanbax_active_section', 'parent-portal');
            break;
        }
        // Hydrate + reload into the portal (never returns in practice).
        await completeRemoteLogin(res.token!, sectionByRole[role]);
        return {
          success: true,
          role,
          targetSection: sectionByRole[role],
          isAlumni: !!matchedStudent?.isAlumni,
        };
      }
      // unreachable → fall through to local demo credentials below
    }

    // 1. Check Administrator
    if (cleanId === 'admin' || cleanId === 'administrator' || cleanId === 'admin@stanbaxschools.edu.ng' || cleanId === 'principal') {
      if (isAdminPasswordValid(cleanPass)) {
        clearOtherRoles('admin');
        setIsAdminAuthenticated(true);
        localStorage.setItem('stanbax_admin_auth', 'true');
        sessionStorage.setItem('stanbax_admin_auth', 'true');
        localStorage.setItem('stanbax_active_section', 'admin-portal');
        sessionStorage.setItem('stanbax_active_section', 'admin-portal');
        return { success: true, role: 'admin', targetSection: 'admin-portal' };
      } else {
        return { success: false, message: 'Incorrect administrator password.' };
      }
    }

    // 2. Check Proprietress
    if (cleanId === 'proprietress' || cleanId === 'proprietress@stanbaxschools.edu.ng' || cleanId === 'mrs.bello' || cleanId === 'adebisi.bello') {
      if (isProprietressPasswordValid(cleanPass)) {
        clearOtherRoles('proprietress');
        setIsProprietressAuthenticated(true);
        localStorage.setItem('stanbax_proprietress_auth', 'true');
        sessionStorage.setItem('stanbax_proprietress_auth', 'true');
        localStorage.setItem('stanbax_active_section', 'proprietress-portal');
        sessionStorage.setItem('stanbax_active_section', 'proprietress-portal');
        return { success: true, role: 'proprietress', targetSection: 'proprietress-portal' };
      } else {
        return { success: false, message: 'Incorrect proprietress password.' };
      }
    }

    // 2B. Check Head Mistress (Executive Academic Head)
    if (
      cleanId === 'headmistress' || 
      cleanId === 'head_mistress' || 
      cleanId === 'headmistress@stanbaxschools.edu.ng' || 
      cleanId === 'hm' || 
      cleanId === 'mrs.adediran' || 
      (headmistressProfile.email && cleanId === headmistressProfile.email.toLowerCase())
    ) {
      if (cleanPass === headmistressPassword) {
        clearOtherRoles('headmistress');
        setIsHeadmistressAuthenticated(true);
        localStorage.setItem('stanbax_headmistress_auth', 'true');
        sessionStorage.setItem('stanbax_headmistress_auth', 'true');
        localStorage.setItem('stanbax_active_section', 'headmistress-portal');
        sessionStorage.setItem('stanbax_active_section', 'headmistress-portal');
        return { success: true, role: 'headmistress', targetSection: 'headmistress-portal' };
      } else {
        return { success: false, message: 'Incorrect Head Mistress password.' };
      }
    }

    // 2C. Check Moderator
    const matchedMod = moderators.find(m => 
      m.email.toLowerCase() === cleanId || 
      m.id.toLowerCase() === cleanId || 
      m.name.toLowerCase() === cleanId ||
      cleanId === 'moderator' ||
      cleanId === 'mod' ||
      cleanId === 'chatmod' ||
      cleanId === 'moderator@stanbaxschools.edu.ng'
    );
    if (matchedMod || cleanId === 'moderator' || cleanId === 'mod' || cleanId === 'chatmod' || cleanId === 'moderator@stanbaxschools.edu.ng') {
      if (cleanPass === moderatorPassword) {
        clearOtherRoles('moderator');
        setIsModeratorAuthenticated(true);
        const modId = matchedMod ? matchedMod.id : 'mod-1';
        setActiveModeratorId(modId);
        localStorage.setItem('stanbax_moderator_auth', 'true');
        localStorage.setItem('stanbax_moderator_id', modId);
        sessionStorage.setItem('stanbax_moderator_auth', 'true');
        sessionStorage.setItem('stanbax_moderator_id', modId);
        localStorage.setItem('stanbax_active_section', 'moderator-portal');
        sessionStorage.setItem('stanbax_active_section', 'moderator-portal');
        return { success: true, role: 'moderator', targetSection: 'moderator-portal' };
      } else {
        return { success: false, message: 'Incorrect moderator password.' };
      }
    }

    // 3. Check Faculty Tutors (including elevated scholar tutors)
    const cleanIdNoSpaces = cleanId.replace(/\s+/g, '');
    const matchedTutor = tutors.find(t => {
      const emailNorm = t.email.toLowerCase();
      const staffIdNorm = (t.staffId || '').toLowerCase();
      const idNorm = t.id.toLowerCase();
      const nameNorm = t.name.toLowerCase();
      const originIdNorm = (t.studentOriginId || '').toLowerCase();
      const originRegNorm = (t.studentRegNumber || '').toLowerCase().replace(/\s+/g, '');
      return (
        emailNorm === cleanId || 
        staffIdNorm === cleanId || 
        idNorm === cleanId || 
        nameNorm === cleanId ||
        (t.isUpgraded && (originIdNorm === cleanId || originRegNorm === cleanIdNoSpaces))
      );
    });

    if (matchedTutor) {
      const expectedPass = matchedTutor.password || 'stanbax2025';
      if (cleanPass === expectedPass) {
        clearOtherRoles('tutor');
        setIsTutorAuthenticated(true);
        setActiveTutorId(matchedTutor.id);
        localStorage.setItem('stanbax_tutor_auth', 'true');
        localStorage.setItem('stanbax_tutor_id', matchedTutor.id);
        sessionStorage.setItem('stanbax_tutor_auth', 'true');
        sessionStorage.setItem('stanbax_tutor_id', matchedTutor.id);
        localStorage.setItem('stanbax_active_section', 'tutor-portal');
        sessionStorage.setItem('stanbax_active_section', 'tutor-portal');
        return { success: true, role: 'tutor', targetSection: 'tutor-portal' };
      } else {
        return { success: false, message: 'Incorrect faculty tutor password.' };
      }
    }

    // Check if user entered credentials of an upgraded scholar — route strictly to Faculty Tutor!
    const upgradedStudentAttempt = students.find(s => s.isUpgradedTutor && (
      s.regNumber.toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces ||
      (s.email && s.email.toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces)
    ));
    if (upgradedStudentAttempt) {
      const elevatedTutor = tutors.find(t => t.studentOriginId === upgradedStudentAttempt.id || t.studentRegNumber === upgradedStudentAttempt.regNumber);
      if (elevatedTutor && cleanPass === (elevatedTutor.password || 'stanbax2025')) {
        clearOtherRoles('tutor');
        setIsTutorAuthenticated(true);
        setActiveTutorId(elevatedTutor.id);
        localStorage.setItem('stanbax_tutor_auth', 'true');
        localStorage.setItem('stanbax_tutor_id', elevatedTutor.id);
        sessionStorage.setItem('stanbax_tutor_auth', 'true');
        sessionStorage.setItem('stanbax_tutor_id', elevatedTutor.id);
        localStorage.setItem('stanbax_active_section', 'tutor-portal');
        sessionStorage.setItem('stanbax_active_section', 'tutor-portal');
        return { success: true, role: 'tutor', targetSection: 'tutor-portal' };
      }
    }

    // 4. Check Parents / Guardians
    const matchedParent = parents.find(p => {
      const emailNorm = (p.email || '').toLowerCase();
      const phoneClean = (p.phone || '').replace(/[^0-9]/g, '');
      const idNorm = p.id.toLowerCase();
      const nameNorm = p.fullName.toLowerCase();
      const inputCleanPhone = cleanId.replace(/[^0-9]/g, '');
      return (
        emailNorm === cleanId ||
        idNorm === cleanId ||
        nameNorm === cleanId ||
        (inputCleanPhone.length >= 7 && phoneClean.includes(inputCleanPhone))
      );
    });

    if (matchedParent) {
      const expectedPass = matchedParent.password || 'parent2025';
      if (cleanPass === expectedPass) {
        clearOtherRoles('parent');
        setIsParentAuthenticated(true);
        setActiveParentId(matchedParent.id);
        localStorage.setItem('stanbax_parent_auth', 'true');
        localStorage.setItem('stanbax_parent_id', matchedParent.id);
        sessionStorage.setItem('stanbax_parent_auth', 'true');
        sessionStorage.setItem('stanbax_parent_id', matchedParent.id);
        localStorage.setItem('stanbax_active_section', 'parent-portal');
        sessionStorage.setItem('stanbax_active_section', 'parent-portal');
        return { success: true, role: 'parent', targetSection: 'parent-portal' };
      } else {
        return { success: false, message: 'Incorrect parent portal password.' };
      }
    }

    // 5. Check Students / Scholars / Alumni (EXCLUDING UPGRADED SCHOLARS who are now faculty tutors)
    const matchedStudent = students.find(s => {
      if (s.isUpgradedTutor) return false; // Upgraded scholars can only log in as Tutor!
      const regNorm = s.regNumber.toLowerCase().replace(/\s+/g, '');
      const idNorm = s.id.toLowerCase().replace(/\s+/g, '');
      const emailNorm = (s.email || '').toLowerCase().replace(/\s+/g, '');
      const nameNorm = s.name.toLowerCase();
      return regNorm === cleanIdNoSpaces || idNorm === cleanIdNoSpaces || emailNorm === cleanIdNoSpaces || nameNorm === cleanId || nameNorm.includes(cleanId);
    });

    if (matchedStudent) {
      const expectedPass = matchedStudent.password || 'stanbax2025';
      if (cleanPass === expectedPass) {
        clearOtherRoles('student');
        setIsStudentAuthenticated(true);
        setActiveStudentId(matchedStudent.id);
        localStorage.setItem('stanbax_student_auth', 'true');
        localStorage.setItem('stanbax_student_id', matchedStudent.id);
        sessionStorage.setItem('stanbax_student_auth', 'true');
        sessionStorage.setItem('stanbax_student_id', matchedStudent.id);
        localStorage.setItem('stanbax_active_section', 'student-portal');
        sessionStorage.setItem('stanbax_active_section', 'student-portal');
        return { 
          success: true, 
          role: 'student', 
          targetSection: 'student-portal', 
          isAlumni: !!matchedStudent.isAlumni 
        };
      } else {
        return { success: false, message: 'Incorrect scholar portal password.' };
      }
    }

    return { 
      success: false, 
      message: 'No institutional account matched this identifier. Please verify your credentials or use Forgot Password.' 
    };
  };

  const loginAdmin = async (user: string, pass: string): Promise<boolean> => {
    const trimmedUser = user.trim().toLowerCase();
    const isUserValid = trimmedUser === 'admin' || trimmedUser === 'stanbax' || trimmedUser === 'principal' || trimmedUser === 'administrator' || trimmedUser === 'admin@stanbaxschools.edu.ng';
    if (!isUserValid) return false;
    if (isRemoteEnabled()) {
      const res = await remoteVerifyLogin(trimmedUser, pass);
      if (!res.unreachable) {
        if (!res.ok || res.role !== 'admin') return false;
        setIsAdminAuthenticated(true);
        localStorage.setItem('stanbax_admin_auth', 'true');
        sessionStorage.setItem('stanbax_admin_auth', 'true');
        localStorage.setItem('stanbax_active_section', 'admin-portal');
        sessionStorage.setItem('stanbax_active_section', 'admin-portal');
        await completeRemoteLogin(res.token!, 'admin-portal');
        return true;
      }
    }
    if (isAdminPasswordValid(pass)) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('stanbax_admin_auth', 'true');
      sessionStorage.setItem('stanbax_admin_auth', 'true');
      localStorage.setItem('stanbax_active_section', 'admin-portal');
      sessionStorage.setItem('stanbax_active_section', 'admin-portal');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('stanbax_admin_auth');
    sessionStorage.removeItem('stanbax_admin_auth');
    localStorage.removeItem('stanbax_active_section');
    sessionStorage.removeItem('stanbax_active_section');
    setActiveSection('home');
  };

  const loginProprietress = async (user: string, pass: string): Promise<boolean> => {
    const trimmedUser = user.trim().toLowerCase();
    const isUserValid = trimmedUser === 'proprietress' || trimmedUser === 'headmistress' || trimmedUser === 'proprietress@stanbaxschools.edu.ng';
    if (!isUserValid) return false;
    if (isRemoteEnabled()) {
      const res = await remoteVerifyLogin(trimmedUser, pass);
      if (!res.unreachable) {
        if (!res.ok || res.role !== 'proprietress') return false;
        setIsProprietressAuthenticated(true);
        localStorage.setItem('stanbax_proprietress_auth', 'true');
        sessionStorage.setItem('stanbax_proprietress_auth', 'true');
        localStorage.setItem('stanbax_active_section', 'proprietress-portal');
        sessionStorage.setItem('stanbax_active_section', 'proprietress-portal');
        await completeRemoteLogin(res.token!, 'proprietress-portal');
        return true;
      }
    }
    if (isProprietressPasswordValid(pass)) {
      setIsProprietressAuthenticated(true);
      localStorage.setItem('stanbax_proprietress_auth', 'true');
      sessionStorage.setItem('stanbax_proprietress_auth', 'true');
      localStorage.setItem('stanbax_active_section', 'proprietress-portal');
      sessionStorage.setItem('stanbax_active_section', 'proprietress-portal');
      return true;
    }
    return false;
  };

  const logoutProprietress = () => {
    setIsProprietressAuthenticated(false);
    localStorage.removeItem('stanbax_proprietress_auth');
    sessionStorage.removeItem('stanbax_proprietress_auth');
    localStorage.removeItem('stanbax_active_section');
    sessionStorage.removeItem('stanbax_active_section');
    setActiveSection('home');
  };

  const loginHeadmistress = async (user: string, pass: string): Promise<boolean> => {
    const trimmedUser = user.trim().toLowerCase();
    const isUserValid = 
      trimmedUser === 'headmistress' || 
      trimmedUser === 'head_mistress' || 
      trimmedUser === 'headmistress@stanbaxschools.edu.ng' || 
      trimmedUser === 'hm' || 
      trimmedUser === 'mrs.adediran' || 
      (headmistressProfile.email && trimmedUser === headmistressProfile.email.toLowerCase());
    if (!isUserValid) return false;
    if (isRemoteEnabled()) {
      const res = await remoteVerifyLogin(trimmedUser, pass);
      if (!res.unreachable) {
        if (!res.ok || res.role !== 'headmistress') return false;
        clearOtherRoles('headmistress');
        setIsHeadmistressAuthenticated(true);
        localStorage.setItem('stanbax_headmistress_auth', 'true');
        sessionStorage.setItem('stanbax_headmistress_auth', 'true');
        localStorage.setItem('stanbax_active_section', 'headmistress-portal');
        sessionStorage.setItem('stanbax_active_section', 'headmistress-portal');
        await completeRemoteLogin(res.token!, 'headmistress-portal');
        return true;
      }
    }
    if (pass === headmistressPassword) {
      clearOtherRoles('headmistress');
      setIsHeadmistressAuthenticated(true);
      localStorage.setItem('stanbax_headmistress_auth', 'true');
      sessionStorage.setItem('stanbax_headmistress_auth', 'true');
      localStorage.setItem('stanbax_active_section', 'headmistress-portal');
      sessionStorage.setItem('stanbax_active_section', 'headmistress-portal');
      return true;
    }
    return false;
  };

  const logoutHeadmistress = () => {
    setIsHeadmistressAuthenticated(false);
    localStorage.removeItem('stanbax_headmistress_auth');
    sessionStorage.removeItem('stanbax_headmistress_auth');
    localStorage.removeItem('stanbax_active_section');
    sessionStorage.removeItem('stanbax_active_section');
    setActiveSection('home');
  };

  const loginModerator = async (user: string, pass: string): Promise<boolean> => {
    const trimmedUser = user.trim().toLowerCase();
    const matchedMod = moderators.find(m => 
      m.email.toLowerCase() === trimmedUser || 
      m.id.toLowerCase() === trimmedUser || 
      m.name.toLowerCase() === trimmedUser ||
      trimmedUser === 'moderator' ||
      trimmedUser === 'mod' ||
      trimmedUser === 'chatmod' ||
      trimmedUser === 'moderator@stanbaxschools.edu.ng'
    );
    if (!matchedMod && trimmedUser !== 'moderator' && trimmedUser !== 'mod' && trimmedUser !== 'chatmod' && trimmedUser !== 'moderator@stanbaxschools.edu.ng') {
      return false;
    }
    if (isRemoteEnabled()) {
      const res = await remoteVerifyLogin(trimmedUser, pass);
      if (!res.unreachable) {
        if (!res.ok || res.role !== 'moderator') return false;
        clearOtherRoles('moderator');
        setIsModeratorAuthenticated(true);
        const modId = res.refId || (matchedMod ? matchedMod.id : 'mod-1');
        setActiveModeratorId(modId);
        localStorage.setItem('stanbax_moderator_auth', 'true');
        localStorage.setItem('stanbax_moderator_id', modId);
        sessionStorage.setItem('stanbax_moderator_auth', 'true');
        sessionStorage.setItem('stanbax_moderator_id', modId);
        localStorage.setItem('stanbax_active_section', 'moderator-portal');
        sessionStorage.setItem('stanbax_active_section', 'moderator-portal');
        await completeRemoteLogin(res.token!, 'moderator-portal');
        return true;
      }
    }
    if (pass === moderatorPassword) {
      clearOtherRoles('moderator');
      setIsModeratorAuthenticated(true);
      const modId = matchedMod ? matchedMod.id : 'mod-1';
      setActiveModeratorId(modId);
      localStorage.setItem('stanbax_moderator_auth', 'true');
      localStorage.setItem('stanbax_moderator_id', modId);
      sessionStorage.setItem('stanbax_moderator_auth', 'true');
      sessionStorage.setItem('stanbax_moderator_id', modId);
      localStorage.setItem('stanbax_active_section', 'moderator-portal');
      sessionStorage.setItem('stanbax_active_section', 'moderator-portal');
      return true;
    }
    return false;
  };

  const logoutModerator = () => {
    setIsModeratorAuthenticated(false);
    localStorage.removeItem('stanbax_moderator_auth');
    localStorage.removeItem('stanbax_moderator_id');
    sessionStorage.removeItem('stanbax_moderator_auth');
    sessionStorage.removeItem('stanbax_moderator_id');
    localStorage.removeItem('stanbax_active_section');
    sessionStorage.removeItem('stanbax_active_section');
    setActiveSection('home');
  };

  const loginTutor = async (identifier: string, pass: string): Promise<{ success: boolean; message?: string; tutor?: TutorProfile }> => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, message: 'Please provide your Staff Email Address or Staff ID.' };
    }
    if (!pass || pass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    const matchedTutor = tutors.find(t => 
      t.email.toLowerCase() === cleanId || 
      (t.staffId && t.staffId.toLowerCase() === cleanId) ||
      t.id.toLowerCase() === cleanId ||
      t.name.toLowerCase().includes(cleanId)
    );

    if (isRemoteEnabled()) {
      const res = await remoteVerifyLogin(cleanId, pass);
      if (!res.unreachable) {
        if (!res.ok || res.role !== 'tutor') {
          return { success: false, message: res.message || 'Incorrect staff credentials. Please check your password.' };
        }
        const remoteTutor = res.refId ? tutors.find(t => t.id === res.refId) : matchedTutor;
        clearOtherRoles('tutor');
        setIsTutorAuthenticated(true);
        const tutorId = res.refId || (matchedTutor ? matchedTutor.id : 'tut-1');
        setActiveTutorId(tutorId);
        localStorage.setItem('stanbax_tutor_id', tutorId);
        sessionStorage.setItem('stanbax_tutor_id', tutorId);
        localStorage.setItem('stanbax_tutor_auth', 'true');
        sessionStorage.setItem('stanbax_tutor_auth', 'true');
        localStorage.setItem('stanbax_active_section', 'tutor-portal');
        sessionStorage.setItem('stanbax_active_section', 'tutor-portal');
        await completeRemoteLogin(res.token!, 'tutor-portal');
        return { success: true, tutor: remoteTutor };
      }
    }

    if (!matchedTutor) {
      return { 
        success: false, 
        message: 'Unrecognized faculty account. Please verify your staff email or ID with the ICT Office.' 
      };
    }

    const expectedPass = matchedTutor.password || 'stanbax2025';
    if (pass !== expectedPass) {
      return { success: false, message: 'Incorrect staff credentials. Please check your password.' };
    }

    clearOtherRoles('tutor');
    setIsTutorAuthenticated(true);
    setActiveTutorId(matchedTutor.id);
    localStorage.setItem('stanbax_tutor_auth', 'true');
    localStorage.setItem('stanbax_tutor_id', matchedTutor.id);
    sessionStorage.setItem('stanbax_tutor_auth', 'true');
    sessionStorage.setItem('stanbax_tutor_id', matchedTutor.id);
    localStorage.setItem('stanbax_active_section', 'tutor-portal');
    sessionStorage.setItem('stanbax_active_section', 'tutor-portal');
    return { success: true, tutor: matchedTutor };
  };

  const logoutTutor = () => {
    setIsTutorAuthenticated(false);
    localStorage.removeItem('stanbax_tutor_auth');
    localStorage.removeItem('stanbax_tutor_id');
    sessionStorage.removeItem('stanbax_tutor_auth');
    sessionStorage.removeItem('stanbax_tutor_id');
    localStorage.removeItem('stanbax_active_section');
    sessionStorage.removeItem('stanbax_active_section');
    setActiveSection('home');
  };

  const loginStudent = async (identifier: string, pin: string): Promise<{ success: boolean; message?: string; student?: StudentProfile }> => {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanId) {
      return { success: false, message: 'Please enter scholar Registration Number or Admission ID.' };
    }
    if (!pin || pin.length < 3) {
      return { success: false, message: 'Please enter your scholar portal PIN.' };
    }

    const matchedStudent = students.find(s => {
      const regNorm = s.regNumber.toLowerCase().replace(/\s+/g, '');
      const idNorm = s.id.toLowerCase().replace(/\s+/g, '');
      const nameNorm = s.name.toLowerCase().replace(/\s+/g, '');
      return regNorm === cleanId || idNorm === cleanId || nameNorm.includes(cleanId);
    });

    if (matchedStudent && matchedStudent.isUpgradedTutor) {
      return {
        success: false,
        message: 'This scholar account has been elevated to Faculty Tutor. Please sign in via the Faculty Tutor portal using your Staff credentials.'
      };
    }

    if (isRemoteEnabled()) {
      const res = await remoteVerifyLogin(identifier.trim(), pin);
      if (!res.unreachable) {
        if (!res.ok || res.role !== 'student') {
          return { success: false, message: res.message || 'Incorrect scholar portal password.' };
        }
        const remoteStudent = res.refId ? students.find(s => s.id === res.refId) : matchedStudent;
        if (!remoteStudent && !matchedStudent) {
          return { success: false, message: 'No active student record matches that Registration Number. Please verify registration slip.' };
        }
        const sid = res.refId || matchedStudent!.id;
        clearOtherRoles('student');
        setIsStudentAuthenticated(true);
        setActiveStudentId(sid);
        localStorage.setItem('stanbax_student_auth', 'true');
        localStorage.setItem('stanbax_student_id', sid);
        sessionStorage.setItem('stanbax_student_auth', 'true');
        sessionStorage.setItem('stanbax_student_id', sid);
        localStorage.setItem('stanbax_active_section', 'student-portal');
        sessionStorage.setItem('stanbax_active_section', 'student-portal');
        await completeRemoteLogin(res.token!, 'student-portal');
        return { success: true, student: remoteStudent || matchedStudent };
      }
    }

    if (!matchedStudent) {
      return { 
        success: false, 
        message: 'No active student record matches that Registration Number. Please verify registration slip.' 
      };
    }

    const expectedPass = matchedStudent.password || 'stanbax2025';
    if (pin !== expectedPass) {
      return { success: false, message: 'Incorrect scholar portal password.' };
    }

    clearOtherRoles('student');
    setIsStudentAuthenticated(true);
    setActiveStudentId(matchedStudent.id);
    localStorage.setItem('stanbax_student_auth', 'true');
    localStorage.setItem('stanbax_student_id', matchedStudent.id);
    sessionStorage.setItem('stanbax_student_auth', 'true');
    sessionStorage.setItem('stanbax_student_id', matchedStudent.id);
    localStorage.setItem('stanbax_active_section', 'student-portal');
    sessionStorage.setItem('stanbax_active_section', 'student-portal');
    return { success: true, student: matchedStudent };
  };

  const logoutStudent = () => {
    setIsStudentAuthenticated(false);
    localStorage.removeItem('stanbax_student_auth');
    localStorage.removeItem('stanbax_student_id');
    sessionStorage.removeItem('stanbax_student_auth');
    sessionStorage.removeItem('stanbax_student_id');
    localStorage.removeItem('stanbax_active_section');
    sessionStorage.removeItem('stanbax_active_section');
    setActiveSection('home');
  };

  const loginParent = async (phoneOrEmail: string, pass: string): Promise<{ success: boolean; message?: string; parent?: ParentProfile }> => {
    const cleanId = phoneOrEmail.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId) {
      return { success: false, message: 'Please enter Parent Phone Number or Email Address.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    const matchedParent = parents.find(p => {
      const emailNorm = (p.email || '').toLowerCase();
      const phoneClean = (p.phone || '').replace(/[^0-9]/g, '');
      const idNorm = p.id.toLowerCase();
      const nameNorm = p.fullName.toLowerCase();
      const inputCleanPhone = cleanId.replace(/[^0-9]/g, '');
      return (
        emailNorm === cleanId ||
        idNorm === cleanId ||
        nameNorm === cleanId ||
        (inputCleanPhone.length >= 7 && phoneClean.includes(inputCleanPhone))
      );
    });

    if (isRemoteEnabled()) {
      const res = await remoteVerifyLogin(cleanId, cleanPass);
      if (!res.unreachable) {
        if (!res.ok || res.role !== 'parent') {
          return { success: false, message: res.message || 'Incorrect parent portal password.' };
        }
        const remoteParent = res.refId ? parents.find(p => p.id === res.refId) : matchedParent;
        if (!remoteParent && !matchedParent) {
          return { success: false, message: 'No registered parent/guardian matches this telephone or email.' };
        }
        const pid = res.refId || matchedParent!.id;
        setIsParentAuthenticated(true);
        setActiveParentId(pid);
        localStorage.setItem('stanbax_parent_auth', 'true');
        localStorage.setItem('stanbax_parent_id', pid);
        sessionStorage.setItem('stanbax_parent_auth', 'true');
        sessionStorage.setItem('stanbax_parent_id', pid);
        localStorage.setItem('stanbax_active_section', 'parent-portal');
        sessionStorage.setItem('stanbax_active_section', 'parent-portal');
        await completeRemoteLogin(res.token!, 'parent-portal');
        return { success: true, parent: remoteParent || matchedParent };
      }
    }

    if (!matchedParent) {
      return { success: false, message: 'No registered parent/guardian matches this telephone or email.' };
    }

    const expectedPass = matchedParent.password || 'parent2025';
    if (cleanPass !== expectedPass) {
      return { success: false, message: 'Incorrect parent portal password.' };
    }

    setIsParentAuthenticated(true);
    setActiveParentId(matchedParent.id);
    localStorage.setItem('stanbax_parent_auth', 'true');
    localStorage.setItem('stanbax_parent_id', matchedParent.id);
    sessionStorage.setItem('stanbax_parent_auth', 'true');
    sessionStorage.setItem('stanbax_parent_id', matchedParent.id);
    localStorage.setItem('stanbax_active_section', 'parent-portal');
    sessionStorage.setItem('stanbax_active_section', 'parent-portal');
    return { success: true, parent: matchedParent };
  };

  const logoutParent = () => {
    setIsParentAuthenticated(false);
    localStorage.removeItem('stanbax_parent_auth');
    localStorage.removeItem('stanbax_parent_id');
    sessionStorage.removeItem('stanbax_parent_auth');
    sessionStorage.removeItem('stanbax_parent_id');
    localStorage.removeItem('stanbax_active_section');
    sessionStorage.removeItem('stanbax_active_section');
    setActiveSection('home');
  };

  const logoutAll = () => {
    void remoteLogout();
    logoutAdmin();
    logoutProprietress();
    logoutHeadmistress();
    logoutModerator();
    logoutTutor();
    logoutStudent();
    logoutParent();
    try {
      localStorage.removeItem('stanbax_active_section');
      sessionStorage.removeItem('stanbax_active_section');
    } catch {}
    setActiveSection('home');
  };

  // 13B. Alumni Management
  const toggleStudentAlumni = (studentId: string, isAlumni: boolean, graduationSession?: string) => {
    const sessionToUse = graduationSession || `${schoolInfo.activeSession} (Graduated Alumni)`;
    updateStudent(studentId, {
      isAlumni,
      graduationSession: isAlumni ? sessionToUse : undefined
    });
  };

  // 13C. Upgrade Student to Tutor with Onboarding Requirement
  const upgradeStudentToTutor = (studentId: string): { success: boolean; tutorId?: string; message: string } => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) {
      return { success: false, message: 'Student record not found.' };
    }

    const staffNum = tutors.length + 1;
    const staffId = `STX-TUT-${String(staffNum).padStart(3, '0')}`;
    const tutorId = `tut-upg-${Date.now()}`;
    const tutorEmail = targetStudent.email || `${targetStudent.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@stanbaxschools.edu.ng`;
    const tutorPassword = targetStudent.password || 'stanbax2025';

    const newTutorProfile: TutorProfile = {
      id: tutorId,
      staffId,
      name: targetStudent.name,
      role: 'Associate Faculty / Scholar Tutor',
      qualification: 'Stanbax Teaching Fellow (TRCN Aspirant)',
      department: 'Sciences & STEM Faculty',
      email: tutorEmail,
      password: tutorPassword,
      phone: targetStudent.emergencyPhone || '+234 803 000 0000',
      isUpgraded: true,
      profileCompleted: false, // User must complete necessary details on portal entry!
      studentOriginId: targetStudent.id,
      studentRegNumber: targetStudent.regNumber,
      assignedClasses: [targetStudent.grade],
      assignedSubjects: ['Mathematics', 'Basic Science & Technology']
    };

    setTutors(prev => {
      const updated = [...prev, newTutorProfile];
      try {
        localStorage.setItem('stanbax_tutors', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    updateStudent(studentId, {
      isUpgradedTutor: true
    });

    // If this student was currently authenticated, clear their student session
    // to prevent conflicting dual-role session state (so they log in strictly as Tutor)
    if (activeStudentId === studentId || isStudentAuthenticated) {
      setIsStudentAuthenticated(false);
      setActiveStudentId('');
      try {
        localStorage.removeItem('stanbax_student_auth');
        localStorage.removeItem('stanbax_student_id');
        sessionStorage.removeItem('stanbax_student_auth');
        sessionStorage.removeItem('stanbax_student_id');
      } catch {}
    }

    return {
      success: true,
      tutorId,
      message: `${targetStudent.name} successfully elevated to Faculty Tutor (Staff ID: ${staffId}). On login, they will be required to complete their profile details.`
    };
  };

  const completeTutorProfile = (tutorId: string, data: Partial<TutorProfile>) => {
    updateTutor(tutorId, {
      ...data,
      profileCompleted: true
    });
  };

  // 13D. Admin Creation of New Tutor Account
  const createTutorAccount = (data: {
    name: string;
    email: string;
    staffId?: string;
    password: string;
    department: string;
    role: string;
    qualification: string;
    assignedClasses: string[];
    assignedSubjects: string[];
    phone?: string;
    bio?: string;
  }): TutorProfile => {
    const staffNum = tutors.length + 1;
    const staffId = data.staffId?.trim() || `STX-TUT-${String(staffNum).padStart(3, '0')}`;
    const newTutor: TutorProfile = {
      id: `tut-${Date.now()}`,
      staffId,
      name: data.name,
      email: data.email,
      password: data.password || 'stanbax2025',
      department: data.department || 'Sciences & STEM Faculty',
      role: data.role || 'Subject Teacher',
      qualification: data.qualification || 'B.Sc / B.Ed, TRCN Certified',
      assignedClasses: data.assignedClasses || [],
      assignedSubjects: data.assignedSubjects || [],
      phone: data.phone || '+234 803 000 0000',
      bio: data.bio || '',
      profileCompleted: true,
      isUpgraded: false
    };

    setTutors(prev => {
      const updated = [...prev, newTutor];
      try {
        localStorage.setItem('stanbax_tutors', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    void remoteCreateCredential(
      newTutor.email,
      newTutor.password || 'stanbax2025',
      'tutor',
      newTutor.id,
      [staffId.toLowerCase(), data.name.toLowerCase()].filter(Boolean)
    );

    return newTutor;
  };

  // 13E. Password Management for All Roles
  const changePassword = (
    userRole: UserRole,
    currentPass: string,
    newPass: string,
    userId?: string
  ): { success: boolean; message: string } => {
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    if (userRole === 'admin') {
      if (!isAdminPasswordValid(currentPass)) {
        return { success: false, message: 'Current administrator password is incorrect.' };
      }
      setAdminPassword(newPass);
      localStorage.setItem('stanbax_admin_password', newPass);
      void remoteChangePassword('admin', currentPass, newPass);
      return { success: true, message: 'Administrator password successfully updated!' };
    }

    if (userRole === 'proprietress') {
      if (!isProprietressPasswordValid(currentPass)) {
        return { success: false, message: 'Current proprietress password is incorrect.' };
      }
      setProprietressPassword(newPass);
      localStorage.setItem('stanbax_proprietress_password', newPass);
      void remoteChangePassword('proprietress', currentPass, newPass);
      return { success: true, message: 'Proprietress password successfully updated!' };
    }

    if (userRole === 'tutor') {
      const targetId = userId || activeTutorId;
      const targetTutor = tutors.find(t => t.id === targetId);
      if (!targetTutor) {
        return { success: false, message: 'Tutor account not found.' };
      }
      const currentStored = targetTutor.password || 'stanbax2025';
      if (currentPass !== currentStored && currentPass !== 'stanbax2025') {
        return { success: false, message: 'Current tutor password is incorrect.' };
      }
      updateTutor(targetId, { password: newPass });
      void remoteChangePassword(targetTutor.email || targetId, currentPass, newPass);
      return { success: true, message: 'Faculty password successfully updated!' };
    }

    if (userRole === 'student') {
      const targetId = userId || activeStudentId;
      const targetStudent = students.find(s => s.id === targetId);
      if (!targetStudent) {
        return { success: false, message: 'Student account not found.' };
      }
      const currentStored = targetStudent.password || 'stanbax2025';
      if (currentPass !== currentStored && currentPass !== 'stanbax2025') {
        return { success: false, message: 'Current student password is incorrect.' };
      }
      updateStudent(targetId, { password: newPass });
      void remoteChangePassword(targetStudent.regNumber || targetId, currentPass, newPass);
      return { success: true, message: 'Scholar portal password successfully updated!' };
    }

    return { success: false, message: 'Invalid user role.' };
  };

  const forgotPasswordReset = async (
    identifier: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = newPassword.trim();
    if (!cleanId) return { success: false, message: 'Please enter your username, email, Reg No, or Staff ID.' };
    if (!cleanPass || cleanPass.length < 6) return { success: false, message: 'New password must be at least 6 characters long.' };

    // 1. Remote password reset in Supabase central database
    if (isRemoteEnabled()) {
      const res = await remoteResetPassword(cleanId, cleanPass);
      if (res.ok) {
        const detectedRole = (res.role as UserRole) || 'student';
        if (detectedRole === 'admin') {
          setAdminPassword(cleanPass);
          localStorage.setItem('stanbax_admin_password', cleanPass);
        } else if (detectedRole === 'proprietress') {
          setProprietressPassword(cleanPass);
          localStorage.setItem('stanbax_proprietress_password', cleanPass);
        } else if (detectedRole === 'headmistress') {
          setHeadmistressPassword(cleanPass);
          localStorage.setItem('stanbax_headmistress_password', cleanPass);
        } else if (detectedRole === 'moderator') {
          setModeratorPassword(cleanPass);
          localStorage.setItem('stanbax_moderator_password', cleanPass);
        } else if (detectedRole === 'tutor') {
          const t = tutors.find(item => item.id === res.refId || item.email.toLowerCase() === cleanId);
          if (t) updateTutor(t.id, { password: cleanPass });
        } else if (detectedRole === 'student') {
          const s = students.find(item => item.id === res.refId || item.regNumber.toLowerCase() === cleanId);
          if (s) updateStudent(s.id, { password: cleanPass });
        } else if (detectedRole === 'parent') {
          const p = parents.find(item => item.id === res.refId || item.email?.toLowerCase() === cleanId);
          if (p) updateParent(p.id, { password: cleanPass });
        }
        return {
          success: true,
          message: res.message || 'Password successfully updated in Supabase database!',
          role: detectedRole,
        };
      } else if (!res.message.includes('offline') && !res.message.includes('not configured')) {
        return { success: false, message: res.message };
      }
    }

    // 2. Local Fallback
    // Admin
    if (cleanId === 'admin' || cleanId === 'admin@stanbaxschools.edu.ng' || cleanId === 'administrator') {
      return { 
        success: false, 
        message: 'Administrator account is protected by a security question to prevent unauthorized access. Please provide your security question answer to reset.' 
      };
    }

    // Proprietress
    if (cleanId === 'proprietress' || cleanId === 'proprietress@stanbaxschools.edu.ng') {
      setProprietressPassword(newPassword);
      localStorage.setItem('stanbax_proprietress_password', newPassword);
      return { success: true, message: 'Proprietress password has been reset successfully!', role: 'proprietress' };
    }

    // Headmistress
    if (cleanId === 'headmistress' || cleanId === 'headmistress@stanbaxschools.edu.ng' || (headmistressProfile.email && cleanId === headmistressProfile.email.toLowerCase())) {
      setHeadmistressPassword(newPassword);
      localStorage.setItem('stanbax_headmistress_password', newPassword);
      return { success: true, message: 'Head Mistress password has been reset successfully!', role: 'headmistress' };
    }

    // Moderator
    const matchedMod = moderators.find(m => m.email.toLowerCase() === cleanId || m.id.toLowerCase() === cleanId);
    if (matchedMod || cleanId === 'moderator' || cleanId === 'moderator@stanbaxschools.edu.ng') {
      setModeratorPassword(newPassword);
      localStorage.setItem('stanbax_moderator_password', newPassword);
      return { success: true, message: 'Moderator password has been reset successfully!', role: 'moderator' };
    }

    // Tutors (including upgraded scholars)
    const cleanIdNoSpaces = cleanId.replace(/\s+/g, '');
    const targetTutor = tutors.find(t => 
      t.email.toLowerCase() === cleanId || 
      (t.staffId && t.staffId.toLowerCase() === cleanId) || 
      t.id.toLowerCase() === cleanId ||
      t.name.toLowerCase() === cleanId ||
      (t.studentOriginId && t.studentOriginId.toLowerCase() === cleanId) ||
      (t.studentRegNumber && t.studentRegNumber.toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces)
    );
    if (targetTutor) {
      updateTutor(targetTutor.id, { password: newPassword });
      return { success: true, message: `Password reset for tutor ${targetTutor.name}!`, role: 'tutor' };
    }

    // Students (excluding upgraded scholars who are now faculty tutors)
    const targetStudent = students.find(s => 
      !s.isUpgradedTutor && (
        s.regNumber.toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces ||
        (s.email && s.email.toLowerCase() === cleanId) ||
        s.id.toLowerCase() === cleanId ||
        s.name.toLowerCase() === cleanId
      )
    );
    if (targetStudent) {
      updateStudent(targetStudent.id, { password: newPassword });
      return { success: true, message: `Password reset for scholar ${targetStudent.name}!`, role: 'student' };
    }

    return { success: false, message: 'No registered user found with that identifier.' };
  };

  const getSecurityQuestionForUser = (identifier: string): {
    exists: boolean;
    hasQuestion: boolean;
    securityQuestion?: string;
    name?: string;
    role?: UserRole;
    message?: string;
  } => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) return { exists: false, hasQuestion: false, message: 'Please enter an institutional identifier.' };

    const cleanIdNoSpaces = cleanId.replace(/\s+/g, '');

    // Check Headmistress
    if (cleanId === 'headmistress' || cleanId === 'headmistress@stanbaxschools.edu.ng' || (headmistressProfile.email && cleanId === headmistressProfile.email.toLowerCase())) {
      return { exists: true, hasQuestion: false, name: headmistressProfile.name, role: 'headmistress' };
    }

    // Check Moderator
    const matchedMod = moderators.find(m => m.email.toLowerCase() === cleanId || m.id.toLowerCase() === cleanId);
    if (matchedMod || cleanId === 'moderator' || cleanId === 'moderator@stanbaxschools.edu.ng') {
      return { exists: true, hasQuestion: false, name: matchedMod ? matchedMod.name : 'Community Moderator', role: 'moderator' };
    }

    // Check Tutors (including elevated scholars)
    const targetTutor = tutors.find(t => 
      t.email.toLowerCase() === cleanId || 
      (t.staffId && t.staffId.toLowerCase() === cleanId) || 
      t.id.toLowerCase() === cleanId ||
      t.name.toLowerCase() === cleanId ||
      (t.studentOriginId && t.studentOriginId.toLowerCase() === cleanId) ||
      (t.studentRegNumber && t.studentRegNumber.toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces)
    );
    if (targetTutor) {
      return {
        exists: true,
        hasQuestion: false,
        name: targetTutor.name,
        role: 'tutor'
      };
    }

    // Check Students (excluding upgraded scholars)
    const targetStudent = students.find(s => 
      !s.isUpgradedTutor && (
        s.regNumber.toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces ||
        (s.email && s.email.toLowerCase() === cleanId) ||
        s.id.toLowerCase() === cleanId ||
        s.name.toLowerCase() === cleanId
      )
    );

    if (targetStudent) {
      return {
        exists: true,
        hasQuestion: !!targetStudent.securityQuestion,
        securityQuestion: targetStudent.securityQuestion,
        name: targetStudent.name,
        role: 'student'
      };
    }

    if (cleanId === 'admin' || cleanId === 'admin@stanbaxschools.edu.ng' || cleanId === 'administrator') {
      return { 
        exists: true, 
        hasQuestion: true, 
        securityQuestion: adminSecurityQuestion, 
        name: 'Administrator', 
        role: 'admin' 
      };
    }

    // Proprietress
    if (cleanId === 'proprietress' || cleanId === 'proprietress@stanbaxschools.edu.ng') {
      return { exists: true, hasQuestion: false, name: proprietressProfile.name || 'Proprietress', role: 'proprietress' };
    }

    return { exists: false, hasQuestion: false, message: 'No user account found matching this identifier.' };
  };

  const resetPasswordWithSecurityAnswer = async (
    identifier: string,
    securityAnswer: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanAnswer = securityAnswer.trim();
    const cleanPass = newPassword.trim();

    if (!cleanId) return { success: false, message: 'Institutional identifier is required.' };
    if (!cleanPass || cleanPass.length < 6) return { success: false, message: 'Password must be at least 6 characters.' };

    // 1. Direct Supabase Remote Password Reset with Security Verification
    if (isRemoteEnabled()) {
      const res = await remoteResetPassword(cleanId, cleanPass, cleanAnswer);
      if (res.ok) {
        const detectedRole = (res.role as UserRole) || 'student';
        if (detectedRole === 'admin') {
          setAdminPassword(cleanPass);
          localStorage.setItem('stanbax_admin_password', cleanPass);
        } else if (detectedRole === 'student') {
          const s = students.find(item => item.id === res.refId || item.regNumber.toLowerCase() === cleanId);
          if (s) updateStudent(s.id, { password: cleanPass });
        }
        return {
          success: true,
          message: res.message || 'Identity verified! Password updated in Supabase central database.',
          role: detectedRole,
        };
      } else if (!res.message.includes('offline') && !res.message.includes('not configured')) {
        return { success: false, message: res.message };
      }
    }

    // 2. Local Fallback when Supabase is unconfigured
    const cleanIdNoSpaces = cleanId.replace(/\s+/g, '');
    const targetStudent = students.find(s => 
      !s.isUpgradedTutor && (
        s.regNumber.toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces ||
        (s.email && s.email.toLowerCase() === cleanId) ||
        s.id.toLowerCase() === cleanId ||
        s.name.toLowerCase() === cleanId
      )
    );

    if (targetStudent) {
      if (targetStudent.securityQuestion) {
        if (!cleanAnswer) {
          return { success: false, message: 'Please provide the answer to your security question.' };
        }
        const expectedAnswer = (targetStudent.securityAnswer || '').trim().toLowerCase();
        if (cleanAnswer.toLowerCase() !== expectedAnswer) {
          return { 
            success: false, 
            message: 'Security verification failed. The provided answer does not match the registered security question answer for this account.' 
          };
        }
      }
      updateStudent(targetStudent.id, { password: cleanPass });
      return { 
        success: true, 
        message: `Security answer verified! Password for scholar ${targetStudent.name} has been updated successfully.`, 
        role: 'student' 
      };
    }

    // Admin account security verification
    if (cleanId === 'admin' || cleanId === 'admin@stanbaxschools.edu.ng' || cleanId === 'administrator') {
      if (!cleanAnswer) {
        return { success: false, message: 'Please provide the answer to the administrator security question.' };
      }
      const expectedAnswer = (adminSecurityAnswer || '').trim().toLowerCase();
      const userAns = cleanAnswer.toLowerCase();
      const expectedNoDot = expectedAnswer.replace(/\.+$/, '');
      const userAnsNoDot = userAns.replace(/\.+$/, '');

      if (userAns !== expectedAnswer && userAnsNoDot !== expectedNoDot) {
        return { 
          success: false, 
          message: 'Security verification failed. The provided answer does not match the administrator security question answer.' 
        };
      }

      setAdminPassword(cleanPass);
      localStorage.setItem('stanbax_admin_password', cleanPass);
      return { 
        success: true, 
        message: 'Administrator identity verified! Password has been updated successfully.', 
        role: 'admin' 
      };
    }

    // Fallback for staff/admin without security questions
    return forgotPasswordReset(identifier, newPassword);
  };

  // 13F. Admin Visibility of Every Password & User Directory
  const getAllUserCredentials = (): UserCredentialItem[] => {
    const list: UserCredentialItem[] = [];

    // Admin
    list.push({
      id: 'usr-admin',
      name: 'Chief Administrator & Registrar',
      role: 'admin',
      roleLabel: 'Administrator',
      primaryIdentifier: 'Admin',
      email: 'admin@stanbaxschools.edu.ng',
      password: adminPassword || DEFAULT_ADMIN_PASSWORD,
      status: 'Active',
      departmentOrGrade: 'ICT & Registry Operations',
      lastUpdated: 'System Master'
    });

    // Proprietress
    list.push({
      id: 'usr-proprietress',
      name: proprietressProfile.name || 'Mrs. Adebisi Folashade Bello',
      role: 'proprietress',
      roleLabel: 'Proprietress',
      primaryIdentifier: 'proprietress',
      email: 'proprietress@stanbaxschools.edu.ng',
      password: proprietressPassword,
      status: 'Active',
      departmentOrGrade: 'Executive Council',
      lastUpdated: 'Executive Master'
    });

    // Head Mistress
    list.push({
      id: 'usr-headmistress',
      name: headmistressProfile.name || 'Mrs. Funmilayo Adediran',
      role: 'headmistress',
      roleLabel: 'Head Mistress / Academic Principal',
      primaryIdentifier: 'headmistress',
      email: headmistressProfile.email || 'headmistress@stanbaxschools.edu.ng',
      password: headmistressPassword || 'Headmistress2025!',
      status: 'Active',
      departmentOrGrade: 'Academic Leadership',
      lastUpdated: 'Executive Master'
    });

    // Moderators
    moderators.forEach(m => {
      list.push({
        id: `usr-${m.id}`,
        name: m.name,
        role: 'moderator',
        roleLabel: 'Community Moderator',
        primaryIdentifier: m.email.split('@')[0] || 'moderator',
        email: m.email,
        password: moderatorPassword || 'Moderator2025!',
        status: m.status,
        departmentOrGrade: m.roleTitle,
        lastUpdated: 'Communications Registry'
      });
    });

    // Tutors (including elevated scholar tutors)
    tutors.forEach(t => {
      list.push({
        id: t.id,
        name: t.name,
        role: 'tutor',
        roleLabel: t.isUpgraded ? 'Associate Faculty (Scholar Tutor)' : 'Faculty Tutor',
        primaryIdentifier: t.staffId || t.email,
        email: t.email,
        password: t.password || 'stanbax2025',
        status: t.isUpgraded 
          ? (t.profileCompleted ? 'Upgraded Tutor' : 'Pending Profile Setup') 
          : 'Active',
        departmentOrGrade: t.department,
        lastUpdated: 'Faculty Registry'
      });
    });

    // Students & Alumni (Exclude Upgraded Tutors who are now in the Faculty Tutor registry)
    students.filter(s => !s.isUpgradedTutor).forEach(s => {
      list.push({
        id: s.id,
        name: s.name,
        role: 'student',
        roleLabel: s.isAlumni ? 'Alumni' : 'Scholar',
        primaryIdentifier: s.regNumber,
        email: s.email || `${s.regNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@stanbaxschools.edu.ng`,
        password: s.password || 'stanbax2025',
        securityQuestion: s.securityQuestion,
        securityAnswer: s.securityAnswer,
        passportPhoto: s.passportPhoto,
        status: s.isAlumni ? 'Alumni' : 'Active',
        departmentOrGrade: s.grade,
        lastUpdated: s.isAlumni ? (s.graduationSession || 'Graduated Alumni') : 'Active Enrollment'
      });
    });

    // Parents / Guardians
    parents.forEach(p => {
      list.push({
        id: p.id,
        name: p.fullName,
        role: 'parent',
        roleLabel: 'Parent / Guardian',
        primaryIdentifier: p.phone || p.email,
        email: p.email,
        password: p.password || 'parent2025',
        status: 'Active',
        departmentOrGrade: 'Parent Portal',
        lastUpdated: 'Family Directory'
      });
    });

    return list;
  };

  const adminResetUserPassword = (userId: string, userRole: UserRole, newPassword: string): boolean => {
    if (!newPassword || newPassword.length < 4) return false;
    void remoteAdminResetPassword(userId, newPassword);

    if (userRole === 'admin') {
      setAdminPassword(newPassword);
      localStorage.setItem('stanbax_admin_password', newPassword);
      void remoteChangePassword('admin', null, newPassword);
      return true;
    }
    if (userRole === 'proprietress') {
      setProprietressPassword(newPassword);
      localStorage.setItem('stanbax_proprietress_password', newPassword);
      void remoteChangePassword('proprietress', null, newPassword);
      return true;
    }
    if (userRole === 'headmistress') {
      setHeadmistressPassword(newPassword);
      localStorage.setItem('stanbax_headmistress_password', newPassword);
      void remoteChangePassword('headmistress', null, newPassword);
      return true;
    }
    if (userRole === 'moderator') {
      setModeratorPassword(newPassword);
      localStorage.setItem('stanbax_moderator_password', newPassword);
      void remoteChangePassword('moderator', null, newPassword);
      return true;
    }
    if (userRole === 'tutor') {
      updateTutor(userId, { password: newPassword });
      return true;
    }
    if (userRole === 'student') {
      updateStudent(userId, { password: newPassword });
      return true;
    }
    if (userRole === 'parent') {
      updateParent(userId, { password: newPassword });
      return true;
    }
    return false;
  };

  // 14. Teacher Lesson Notes & Academic Materials
  const [notesFeatureEnabled, setNotesFeatureEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('stanbax_notes_enabled');
      if (saved !== null) return saved === 'true';
    } catch {}
    return true;
  });

  const [lessonNotes, setLessonNotes] = useState<LessonNote[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_lesson_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_LESSON_NOTES;
  });

  const toggleNotesFeature = (enabled?: boolean) => {
    setNotesFeatureEnabled(prev => {
      const nextVal = enabled !== undefined ? enabled : !prev;
      try {
        localStorage.setItem('stanbax_notes_enabled', String(nextVal));
      } catch {}
      return nextVal;
    });
  };

  const addLessonNote = (noteData: Omit<LessonNote, 'id' | 'datePublished' | 'downloadsCount'>): LessonNote => {
    const newNote: LessonNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      datePublished: new Date().toISOString().split('T')[0],
      downloadsCount: 0
    };
    setLessonNotes(prev => {
      const updated = [newNote, ...prev];
      try {
        localStorage.setItem('stanbax_lesson_notes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return newNote;
  };

  const deleteLessonNote = (id: string): boolean => {
    setLessonNotes(prev => {
      const updated = prev.filter(n => n.id !== id);
      try {
        localStorage.setItem('stanbax_lesson_notes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const deleteTermNotes = (term?: string, session?: string): number => {
    const targetTerm = (term || schoolInfo.activeTerm || '2nd Term').toLowerCase();
    let deletedCount = 0;
    setLessonNotes(prev => {
      const remaining: LessonNote[] = [];
      prev.forEach(note => {
        const matchesTerm = note.term.toLowerCase().includes(targetTerm) || targetTerm.includes(note.term.toLowerCase());
        if (matchesTerm) {
          deletedCount++;
        } else {
          remaining.push(note);
        }
      });
      try {
        localStorage.setItem('stanbax_lesson_notes', JSON.stringify(remaining));
      } catch {}
      return remaining;
    });
    return deletedCount;
  };

  const incrementNoteDownload = (id: string) => {
    setLessonNotes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, downloadsCount: (n.downloadsCount || 0) + 1 } : n);
      try {
        localStorage.setItem('stanbax_lesson_notes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const exportNotesZip = async (term?: string, session?: string): Promise<{ success: boolean; count: number; filename: string }> => {
    const targetTerm = term || schoolInfo.activeTerm || '2nd Term (Lent Term)';
    const targetSession = session || assessmentConfig.activeSession || '2025/2026 Academic Session';

    let notesToExport = lessonNotes.filter(n => 
      n.term.toLowerCase().includes(targetTerm.toLowerCase()) || targetTerm.toLowerCase().includes(n.term.toLowerCase())
    );

    if (notesToExport.length === 0) {
      notesToExport = lessonNotes;
    }

    const zip = new JSZip();

    let catalogContent = `========================================================================\n`;
    catalogContent += `STANBAX SCHOOLS, IBADAN - OFFICIAL LESSON NOTES & STUDY MATERIALS\n`;
    catalogContent += `Academic Session: ${targetSession}\n`;
    catalogContent += `Academic Term: ${targetTerm}\n`;
    catalogContent += `Export Timestamp: ${new Date().toLocaleString()}\n`;
    catalogContent += `Total Published Notes Exported: ${notesToExport.length}\n`;
    catalogContent += `Admin Feature Status: ${notesFeatureEnabled ? 'Active / Enabled' : 'Disabled'}\n`;
    catalogContent += `========================================================================\n\n`;

    notesToExport.forEach((note, index) => {
      catalogContent += `[${index + 1}] ${note.title}\n`;
      catalogContent += `    Subject: ${note.subject} | Target Class: ${note.targetClass}\n`;
      catalogContent += `    Faculty Tutor: ${note.authorName} (${note.authorRole || 'Faculty'})\n`;
      catalogContent += `    Format: ${note.format.toUpperCase()} | Published: ${note.datePublished}\n`;
      catalogContent += `    Downloads Logged: ${note.downloadsCount}\n`;
      if (note.attachment) {
        catalogContent += `    Attachment File: ${note.attachment.name} (${note.attachment.fileSize})\n`;
      }
      catalogContent += `    Lecture Content / Outline:\n    ${note.content.replace(/\n/g, '\n    ')}\n\n`;
      catalogContent += `------------------------------------------------------------------------\n`;

      const safeSubj = note.subject.replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeTitle = note.title.slice(0, 35).replace(/[^a-zA-Z0-9_-]/g, '_');
      const folderName = `${safeSubj}`;

      // Lecture Guide file
      zip.file(`${folderName}/${safeTitle}_Lecture_Guide.txt`, 
        `STANBAX SCHOOLS - OFFICIAL STUDY MATERIAL\n` +
        `SUBJECT: ${note.subject}\n` +
        `TOPIC: ${note.title}\n` +
        `TARGET CLASS: ${note.targetClass}\n` +
        `FACULTY TUTOR: ${note.authorName} (${note.authorRole || 'Faculty'})\n` +
        `TERM / SESSION: ${note.term} • ${note.session}\n` +
        `DATE PUBLISHED: ${note.datePublished}\n\n` +
        `==================== LESSON CONTENT ====================\n\n` +
        `${note.content}\n`
      );

      // Attachment file
      if (note.attachment) {
        if (note.attachment.dataUrl) {
          const commaIndex = note.attachment.dataUrl.indexOf(',');
          if (commaIndex !== -1) {
            const base64Data = note.attachment.dataUrl.slice(commaIndex + 1);
            const fileName = note.attachment.name || `${safeTitle}.${note.format === 'image' ? 'png' : note.format}`;
            zip.file(`${folderName}/${fileName}`, base64Data, { base64: true });
          }
        } else if (note.attachment.textContent) {
          zip.file(`${folderName}/${note.attachment.name || `${safeTitle}.txt`}`, note.attachment.textContent);
        }
      }
    });

    zip.file('README_CATALOG.txt', catalogContent);

    const blob = await zip.generateAsync({ type: 'blob' });
    const cleanTerm = targetTerm.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Stanbax_Lesson_Notes_${cleanTerm}.zip`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, count: notesToExport.length, filename };
  };

  // 18. Database Snapshot Export & Import (Resilience for free hosting on Vercel or GitHub)
  // Every persisted collection is registered here so backup/restore is lossless.
  // The registry is a function so it is only evaluated when a snapshot runs —
  // all setters above (and below in file order) are initialized by then.
  interface SnapshotField {
    key: string;
    storageKey: string;
    label: string;
    get: () => unknown;
    set: (v: any) => void;
    isArray: boolean;
    rawString?: boolean;
  }

  const snapshotFields = (): SnapshotField[] => [
    { key: 'schoolInfo', storageKey: 'stanbax_school_info', label: 'School Info', get: () => schoolInfo, set: setSchoolInfo, isArray: false },
    { key: 'images', storageKey: 'stanbax_app_images', label: 'Site Images', get: () => images, set: setImages, isArray: false },
    { key: 'classes', storageKey: 'stanbax_classes', label: 'Classes', get: () => classes, set: setClasses, isArray: true },
    { key: 'subjects', storageKey: 'stanbax_subjects', label: 'Subjects', get: () => subjects, set: setSubjects, isArray: true },
    { key: 'gradingSystem', storageKey: 'stanbax_grading_system', label: 'Grading System', get: () => gradingSystem, set: setGradingSystem, isArray: true },
    { key: 'tutors', storageKey: 'stanbax_tutors', label: 'Faculty / Tutors', get: () => tutors, set: setTutors, isArray: true },
    { key: 'students', storageKey: 'stanbax_students', label: 'Students', get: () => students, set: setStudents, isArray: true },
    { key: 'parents', storageKey: 'stanbax_parents_list', label: 'Parents', get: () => parents, set: setParents, isArray: true },
    { key: 'homeworks', storageKey: 'stanbax_homeworks', label: 'Homeworks', get: () => homeworks, set: setHomeworks, isArray: true },
    { key: 'notices', storageKey: 'stanbax_notices', label: 'Notices', get: () => notices, set: setNotices, isArray: true },
    { key: 'applications', storageKey: 'stanbax_applications', label: 'Admissions Applications', get: () => applications, set: setApplications, isArray: true },
    { key: 'entranceExamSettings', storageKey: 'stanbax_entrance_exam_settings', label: 'Entrance Exam Settings', get: () => entranceExamSettings, set: setEntranceExamSettings, isArray: false },
    { key: 'broadcastLogs', storageKey: 'stanbax_broadcast_logs', label: 'Broadcast Logs', get: () => broadcastLogs, set: setBroadcastLogs, isArray: true },
    { key: 'inquiries', storageKey: 'stanbax_inquiries', label: 'Contact Inquiries', get: () => inquiries, set: setInquiries, isArray: true },
    { key: 'lessonNotes', storageKey: 'stanbax_lesson_notes', label: 'Lesson Notes', get: () => lessonNotes, set: setLessonNotes, isArray: true },
    { key: 'notesFeatureEnabled', storageKey: 'stanbax_notes_enabled', label: 'Notes Feature Flag', get: () => notesFeatureEnabled, set: setNotesFeatureEnabled, isArray: false },
    { key: 'assessmentConfig', storageKey: 'stanbax_assessment_config', label: 'Assessment Config', get: () => assessmentConfig, set: setAssessmentConfig, isArray: false },
    { key: 'termResumptionConfig', storageKey: 'stanbax_term_resumption_config', label: 'Term Resumption Config', get: () => termResumptionConfig, set: setTermResumptionConfig, isArray: false },
    { key: 'attendanceRecords', storageKey: 'stanbax_attendance_records', label: 'Attendance Registers', get: () => attendanceRecords, set: setAttendanceRecords, isArray: true },
    { key: 'cbtExams', storageKey: 'stanbax_cbt_exams', label: 'CBT Exams', get: () => cbtExams, set: setCbtExams, isArray: true },
    { key: 'cbtAttempts', storageKey: 'stanbax_cbt_attempts', label: 'CBT Attempts', get: () => cbtAttempts, set: setCbtAttempts, isArray: true },
    { key: 'timetables', storageKey: 'stanbax_weekly_timetables', label: 'Weekly Timetables', get: () => timetables, set: setTimetables, isArray: true },
    { key: 'sickBayLogs', storageKey: 'stanbax_sickbay_logs', label: 'Sick-Bay Logs', get: () => sickBayLogs, set: setSickBayLogs, isArray: true },
    { key: 'consultationRequests', storageKey: 'stanbax_parent_consultations', label: 'Parent Consultations', get: () => consultationRequests, set: setConsultationRequests, isArray: true },
    { key: 'feePayments', storageKey: 'stanbax_fee_payments', label: 'Fee Payments', get: () => feePayments, set: setFeePayments, isArray: true },
    { key: 'calvinTokens', storageKey: 'stanbax_calvin_tokens', label: 'Calvin AI Tokens', get: () => calvinTokens, set: setCalvinTokens, isArray: true },
    { key: 'libraryBooks', storageKey: 'stanbax_library_books', label: 'Library Books', get: () => libraryBooks, set: setLibraryBooks, isArray: true },
    { key: 'proprietressProfile', storageKey: 'stanbax_proprietress_profile', label: 'Proprietress Profile', get: () => proprietressProfile, set: setProprietressProfile, isArray: false },
    { key: 'appointments', storageKey: 'stanbax_proprietress_appointments', label: 'Proprietress Appointments', get: () => appointments, set: setAppointments, isArray: true },
    { key: 'messagesToProprietress', storageKey: 'stanbax_proprietress_messages', label: 'Messages to Proprietress', get: () => messagesToProprietress, set: setMessagesToProprietress, isArray: true },
    { key: 'directives', storageKey: 'stanbax_proprietress_directives', label: 'Proprietress Directives', get: () => directives, set: setDirectives, isArray: true },
    { key: 'facultyList', storageKey: 'stanbax_faculty_members', label: 'Faculty Directory', get: () => facultyList, set: setFacultyList, isArray: true },
    { key: 'heroSlides', storageKey: 'stanbax_hero_slides', label: 'Hero Slides', get: () => heroSlides, set: setHeroSlides, isArray: true },
    { key: 'heroHighlights', storageKey: 'stanbax_hero_highlights', label: 'Hero Highlights', get: () => heroHighlights, set: setHeroHighlights, isArray: true },
    { key: 'keyPillars', storageKey: 'stanbax_key_pillars', label: 'Key Pillars', get: () => keyPillars, set: setKeyPillars, isArray: true },
    { key: 'keyPillarsHeader', storageKey: 'stanbax_key_pillars_header', label: 'Key Pillars Header', get: () => keyPillarsHeader, set: setKeyPillarsHeader, isArray: false },
    { key: 'aboutContent', storageKey: 'stanbax_about_content', label: 'About Section', get: () => aboutContent, set: setAboutContent, isArray: false },
    { key: 'academicPrograms', storageKey: 'stanbax_academic_programs', label: 'Academic Programs', get: () => academicPrograms, set: setAcademicPrograms, isArray: true },
    { key: 'featuredCourses', storageKey: 'stanbax_featured_courses', label: 'Featured Courses', get: () => featuredCourses, set: setFeaturedCourses, isArray: true },
    { key: 'clubsList', storageKey: 'stanbax_clubs_list', label: 'Clubs Directory', get: () => clubsList, set: setClubsList, isArray: true },
    { key: 'houseStandings', storageKey: 'stanbax_house_standings', label: 'House Standings', get: () => houseStandings, set: setHouseStandings, isArray: true },
    { key: 'busRoutes', storageKey: 'stanbax_bus_routes', label: 'Bus Routes', get: () => busRoutes, set: setBusRoutes, isArray: true },
    { key: 'mealMenu', storageKey: 'stanbax_meal_menu', label: 'Meal Menu', get: () => mealMenu, set: setMealMenu, isArray: true },
    { key: 'calendarEvents', storageKey: 'stanbax_calendar_events', label: 'Calendar Events', get: () => calendarEvents, set: setCalendarEvents, isArray: true },
    { key: 'testimonials', storageKey: 'stanbax_testimonials', label: 'Testimonials', get: () => testimonials, set: setTestimonials, isArray: true },
    { key: 'testimonialsHeader', storageKey: 'stanbax_testimonials_header', label: 'Testimonials Header', get: () => testimonialsHeader, set: setTestimonialsHeader, isArray: false },
    { key: 'faqs', storageKey: 'stanbax_faq_items', label: 'FAQs', get: () => faqItems, set: setFaqItems, isArray: true },
    { key: 'faqHeader', storageKey: 'stanbax_faq_header', label: 'FAQ Header', get: () => faqHeader, set: setFaqHeader, isArray: false },
    { key: 'adminPassword', storageKey: 'stanbax_admin_password', label: 'Admin Password', get: () => adminPassword, set: setAdminPassword, isArray: false, rawString: true },
    { key: 'proprietressPassword', storageKey: 'stanbax_proprietress_password', label: 'Proprietress Password', get: () => proprietressPassword, set: setProprietressPassword, isArray: false, rawString: true },
    { key: 'adminSecurityQuestion', storageKey: 'stanbax_admin_security_q', label: 'Admin Security Question', get: () => adminSecurityQuestion, set: setAdminSecurityQuestion, isArray: false, rawString: true },
    { key: 'adminSecurityAnswer', storageKey: 'stanbax_admin_security_a', label: 'Admin Security Answer', get: () => adminSecurityAnswer, set: setAdminSecurityAnswer, isArray: false, rawString: true },
    { key: 'schoolRepConfig', storageKey: 'stanbax_school_rep_config', label: 'School Representative Config', get: () => schoolRepConfig, set: setSchoolRepConfig, isArray: false },
    { key: 'visitorConversations', storageKey: 'stanbax_visitor_conversations', label: 'Visitor Inquiries & Live Chat', get: () => visitorConversations, set: setVisitorConversations, isArray: true }
  ];

  const exportDatabaseSnapshot = (): string => {
    const backup: Record<string, unknown> = {
      version: '2.0',
      schoolName: 'Stanbax Schools Ibadan',
      exportedAt: new Date().toISOString()
    };
    snapshotFields().forEach(f => {
      backup[f.key] = f.get();
    });
    return JSON.stringify(backup, null, 2);
  };

  const importDatabaseSnapshot = (jsonData: string): { success: boolean; message: string; recordCounts?: Record<string, number> } => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid backup file format.' };
      }
      const counts: Record<string, number> = {};
      snapshotFields().forEach(f => {
        const value = (parsed as Record<string, unknown>)[f.key];
        if (value === undefined || value === null) return;
        if (f.isArray && !Array.isArray(value)) return;
        f.set(value);
        try {
          localStorage.setItem(f.storageKey, f.rawString ? String(value) : JSON.stringify(value));
        } catch {}
        counts[f.label] = Array.isArray(value) ? value.length : 1;
      });

      // Legacy backups (v1.0) carried one shared `grades` list — assign it to
      // the scholar account it belonged to if they have no gradebook yet.
      if (Array.isArray(parsed.grades)) {
        const ownerId = sessionStorage.getItem('stanbax_student_id') || 'stu-1';
        setStudents(prev => {
          const updated = prev.map(s =>
            s.id === ownerId && (!s.grades || s.grades.length === 0)
              ? { ...s, grades: parsed.grades as GradeRecord[] }
              : s
          );
          try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
          return updated;
        });
        counts['Grade Records (legacy)'] = parsed.grades.length;
      }

      return {
        success: true,
        message: 'School database successfully restored! All records synchronized across portals with zero database issues.',
        recordCounts: counts
      };
    } catch (err: any) {
      return { success: false, message: `Failed to import database: ${err?.message || 'Invalid JSON file'}` };
    }
  };

  const syncEntireDatabaseToSupabase = async (): Promise<{ ok: boolean; message: string; count?: number }> => {
    const snapshotObj: Record<string, unknown> = {};
    snapshotFields().forEach(f => {
      snapshotObj[f.storageKey] = f.get();
    });
    return await pushAllDataToSupabase(snapshotObj);
  };

  // 19. Attendance & Term Resumption Management State
  const [termResumptionConfig, setTermResumptionConfig] = useState<TermResumptionConfig>(() => {
    try {
      const saved = localStorage.getItem('stanbax_term_resumption_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      termStartDate: '2026-09-15',
      termEndDate: '2026-12-18',
      termName: '1st Term',
      session: '2026/2027 Academic Session',
      isTermActive: true,
      totalSchoolDaysPlanned: 60
    };
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceDailyRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_attendance_records');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'att-day-1',
        classId: 'cls-14',
        className: 'SSS 2 Science',
        date: '2026-09-15',
        dayNumber: 1,
        term: '1st Term',
        session: '2026/2027 Academic Session',
        submittedByTutorId: 'tut-1',
        submittedByTutorName: 'Mr. Olumide Ogunleye',
        submittedAt: '2026-09-15T14:30:00.000Z',
        studentsAttendance: [
          { studentId: 'stu-1', studentName: 'Tiwa Adeleke', regNumber: 'STX/2023/042', status: 'Present' },
          { studentId: 'stu-2', studentName: 'Babatunde Akindele', regNumber: 'STX/2023/043', status: 'Present' },
          { studentId: 'stu-3', studentName: 'Chidera Okafor', regNumber: 'STX/2023/044', status: 'Present' },
          { studentId: 'stu-4', studentName: 'Damilola Fashola', regNumber: 'STX/2023/045', status: 'Late' },
          { studentId: 'stu-5', studentName: 'Efe Oghomwen', regNumber: 'STX/2023/046', status: 'Present' },
          { studentId: 'stu-6', studentName: 'Farouk Danjuma', regNumber: 'STX/2023/047', status: 'Absent' }
        ]
      },
      {
        id: 'att-day-2',
        classId: 'cls-14',
        className: 'SSS 2 Science',
        date: '2026-09-16',
        dayNumber: 2,
        term: '1st Term',
        session: '2026/2027 Academic Session',
        submittedByTutorId: 'tut-1',
        submittedByTutorName: 'Mr. Olumide Ogunleye',
        submittedAt: '2026-09-16T14:25:00.000Z',
        studentsAttendance: [
          { studentId: 'stu-1', studentName: 'Tiwa Adeleke', regNumber: 'STX/2023/042', status: 'Present' },
          { studentId: 'stu-2', studentName: 'Babatunde Akindele', regNumber: 'STX/2023/043', status: 'Present' },
          { studentId: 'stu-3', studentName: 'Chidera Okafor', regNumber: 'STX/2023/044', status: 'Present' },
          { studentId: 'stu-4', studentName: 'Damilola Fashola', regNumber: 'STX/2023/045', status: 'Present' },
          { studentId: 'stu-5', studentName: 'Efe Oghomwen', regNumber: 'STX/2023/046', status: 'Present' },
          { studentId: 'stu-6', studentName: 'Farouk Danjuma', regNumber: 'STX/2023/047', status: 'Present' }
        ]
      }
    ];
  });

  // Automatically reset the daily attendance records and student counter metrics
  const resetDailyAttendanceCounter = () => {
    setAttendanceRecords([]);
    try {
      localStorage.removeItem('stanbax_attendance_records');
    } catch {}

    // Reset student cumulative attendance counts to zero for the fresh term cycle
    setStudents(prev => {
      const updated = prev.map(stud => ({
        ...stud,
        attendanceDays: 0,
        totalSchoolDays: 0,
        attendancePercent: 0
      }));
      try {
        localStorage.setItem('stanbax_students', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const setTermStartDate = (
    date: string,
    options?: {
      termEndDate?: string;
      termName?: string;
      sessionName?: string;
      shouldResetAttendance?: boolean;
    }
  ) => {
    const shouldReset = options?.shouldResetAttendance !== false;
    const computedEndDate = options?.termEndDate || termResumptionConfig.termEndDate || '2026-12-18';
    const computedTermName = options?.termName || termResumptionConfig.termName;
    const computedSession = options?.sessionName || termResumptionConfig.session;

    const updated: TermResumptionConfig = {
      ...termResumptionConfig,
      termStartDate: date,
      termEndDate: computedEndDate,
      termName: computedTermName,
      session: computedSession,
      isTermActive: true
    };
    setTermResumptionConfig(updated);
    try { localStorage.setItem('stanbax_term_resumption_config', JSON.stringify(updated)); } catch {}

    updateSchoolInfo({
      resumptionDate: date,
      vacationDate: computedEndDate,
      ...(options?.termName ? { activeTerm: options.termName } : {}),
      ...(options?.sessionName ? { activeSession: options.sessionName } : {})
    });

    // Automatically trigger the resetting of the daily attendance counter for teachers
    if (shouldReset) {
      resetDailyAttendanceCounter();
    }
  };

  const setTermResumptionDate = (date: string, termName?: string, sessionName?: string, termEndDate?: string) => {
    setTermStartDate(date, {
      termEndDate,
      termName,
      sessionName,
      shouldResetAttendance: true
    });
  };

  const startNewTerm = (termName: string, startDate: string, sessionName?: string, endDate?: string) => {
    const computedEndDate = endDate || (termName === '1st Term' ? '2026-12-18' : termName === '2nd Term' ? '2027-04-02' : '2027-07-16');
    const updated: TermResumptionConfig = {
      termStartDate: startDate,
      termEndDate: computedEndDate,
      termName: termName,
      session: sessionName || assessmentConfig.activeSession || '2025/2026 Academic Session',
      isTermActive: true,
      totalSchoolDaysPlanned: 60
    };
    setTermResumptionConfig(updated);
    try { localStorage.setItem('stanbax_term_resumption_config', JSON.stringify(updated)); } catch {}

    updateSchoolInfo({
      resumptionDate: startDate,
      vacationDate: computedEndDate,
      activeTerm: `${termName} ${termName === '1st Term' ? '(Michaelmas Term)' : termName === '2nd Term' ? '(Lent Term)' : '(Trinity Term)'}`,
      ...(sessionName ? { activeSession: sessionName } : {})
    });

    updateAssessmentConfig({
      activeTerm: termName as any,
      activePhase: 'mid_term_ca'
    });

    // Automatically trigger the resetting of the daily attendance counter for teachers
    resetDailyAttendanceCounter();
  };

  const submitDailyAttendance = (recordData: Omit<AttendanceDailyRecord, 'id' | 'submittedAt'>) => {
    const newRecordId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: AttendanceDailyRecord = {
      ...recordData,
      id: newRecordId,
      submittedAt: new Date().toISOString()
    };

    const existingIndex = attendanceRecords.findIndex(
      r => r.classId === recordData.classId && r.date === recordData.date
    );

    let updatedRecords: AttendanceDailyRecord[];
    if (existingIndex >= 0) {
      updatedRecords = [...attendanceRecords];
      updatedRecords[existingIndex] = newRecord;
    } else {
      updatedRecords = [...attendanceRecords, newRecord];
    }

    setAttendanceRecords(updatedRecords);
    try { localStorage.setItem('stanbax_attendance_records', JSON.stringify(updatedRecords)); } catch {}

    // Synchronize attendance into students state for report cards and student portal
    const targetTerm = recordData.term || termResumptionConfig.termName;
    const termClassRecords = updatedRecords.filter(
      r => r.classId === recordData.classId && (!targetTerm || !r.term || r.term.toLowerCase().includes(targetTerm.toLowerCase()))
    );
    const totalDaysCount = termClassRecords.length;

    setStudents(prev => {
      const updated = prev.map(stud => {
        const studentEntries = termClassRecords.flatMap(r => 
          r.studentsAttendance.filter(entry => entry.studentId === stud.id || entry.regNumber === stud.regNumber)
        );

        if (studentEntries.length === 0) return stud;

        const daysPresent = studentEntries.filter(e => e.status === 'Present').length;
        const daysLate = studentEntries.filter(e => e.status === 'Late').length;
        const effectivePresent = daysPresent + (daysLate * 0.5);
        const computedPercent = totalDaysCount > 0 ? Math.round((effectivePresent / totalDaysCount) * 100) : 100;

        return {
          ...stud,
          attendanceDays: daysPresent + daysLate,
          totalSchoolDays: totalDaysCount,
          attendancePercent: computedPercent
        };
      });
      try {
        localStorage.setItem('stanbax_students', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return newRecord;
  };

  const getClassAttendanceSummary = (classId: string, term?: string): ClassAttendanceSummary => {
    const targetTerm = term || termResumptionConfig.termName;
    const classRecords = attendanceRecords.filter(
      r => (r.classId === classId || r.className?.toLowerCase() === classId?.toLowerCase()) &&
           (!targetTerm || !r.term || r.term.toLowerCase().includes(targetTerm.toLowerCase()))
    );

    const totalDaysMarked = classRecords.length;

    const classStudents = students.filter(s => {
      const g = (s.grade || '').toLowerCase();
      const c = (classId || '').toLowerCase();
      return g.includes(c) || c.includes(g) || s.classId === classId;
    });

    const studentSummaries: StudentAttendanceSummary[] = classStudents.map(student => {
      const studentEntries = classRecords.flatMap(r => 
        r.studentsAttendance.filter(entry => entry.studentId === student.id || entry.regNumber === student.regNumber)
      );

      const daysPresent = studentEntries.filter(e => e.status === 'Present').length;
      const daysLate = studentEntries.filter(e => e.status === 'Late').length;
      const daysAbsent = studentEntries.filter(e => e.status === 'Absent').length;
      const effectivePresent = daysPresent + (daysLate * 0.5);
      const attendancePercent = totalDaysMarked > 0 ? Math.round((effectivePresent / totalDaysMarked) * 100) : 100;

      return {
        studentId: student.id,
        studentName: student.name,
        regNumber: student.regNumber,
        daysPresent,
        daysLate,
        daysAbsent,
        totalMarkedDays: totalDaysMarked,
        attendancePercent
      };
    });

    const avg = studentSummaries.length > 0 
      ? Math.round(studentSummaries.reduce((sum, s) => sum + s.attendancePercent, 0) / studentSummaries.length)
      : 100;

    const matchedClass = classes.find(c => c.id === classId);

    return {
      classId,
      className: matchedClass?.name || classId,
      totalDaysMarked,
      studentSummaries,
      classAverageAttendancePercent: avg
    };
  };

  const getStudentAttendanceSummary = (studentId: string, term?: string): StudentAttendanceSummary => {
    const targetTerm = term || termResumptionConfig.termName;
    const student = students.find(s => s.id === studentId);
    
    const matchingRecords = attendanceRecords.filter(r => 
      (!targetTerm || !r.term || r.term.toLowerCase().includes(targetTerm.toLowerCase())) &&
      r.studentsAttendance.some(e => e.studentId === studentId || (student && e.regNumber === student.regNumber))
    );

    const totalDaysMarked = matchingRecords.length;
    const studentEntries = matchingRecords.flatMap(r => 
      r.studentsAttendance.filter(e => e.studentId === studentId || (student && e.regNumber === student.regNumber))
    );

    const daysPresent = studentEntries.filter(e => e.status === 'Present').length;
    const daysLate = studentEntries.filter(e => e.status === 'Late').length;
    const daysAbsent = studentEntries.filter(e => e.status === 'Absent').length;
    const effectivePresent = daysPresent + (daysLate * 0.5);
    const attendancePercent = totalDaysMarked > 0 ? Math.round((effectivePresent / totalDaysMarked) * 100) : 100;

    return {
      studentId,
      studentName: student?.name || 'Scholar',
      regNumber: student?.regNumber || '',
      daysPresent,
      daysLate,
      daysAbsent,
      totalMarkedDays: totalDaysMarked,
      attendancePercent
    };
  };

  // 15. Active Section View with Refresh & Multi-Session Persistence
  const [activeSection, setActiveSectionState] = useState<PageSection>(() => {
    try {
      // 1. Check if remote verification asked to resume a section
      const resume = sessionStorage.getItem('stanbax_resume_section');
      if (resume) {
        sessionStorage.removeItem('stanbax_resume_section');
        return resume as PageSection;
      }

      // 2. Check saved section in localStorage / sessionStorage
      const savedSection = localStorage.getItem('stanbax_active_section') || sessionStorage.getItem('stanbax_active_section');

      // 3. Check role authentication states
      const hasAdmin = localStorage.getItem('stanbax_admin_auth') === 'true' || sessionStorage.getItem('stanbax_admin_auth') === 'true';
      const hasProprietress = localStorage.getItem('stanbax_proprietress_auth') === 'true' || sessionStorage.getItem('stanbax_proprietress_auth') === 'true';
      const hasTutor = localStorage.getItem('stanbax_tutor_auth') === 'true' || sessionStorage.getItem('stanbax_tutor_auth') === 'true';
      const hasStudent = localStorage.getItem('stanbax_student_auth') === 'true' || sessionStorage.getItem('stanbax_student_auth') === 'true';
      const hasParent = localStorage.getItem('stanbax_parent_auth') === 'true' || sessionStorage.getItem('stanbax_parent_auth') === 'true';

      if (savedSection) {
        if (savedSection === 'admin-portal' && hasAdmin) return 'admin-portal';
        if (savedSection === 'proprietress-portal' && hasProprietress) return 'proprietress-portal';
        if (savedSection === 'tutor-portal' && hasTutor) return 'tutor-portal';
        if (savedSection === 'student-portal' && hasStudent) return 'student-portal';
        if (savedSection === 'parent-portal' && hasParent) return 'parent-portal';

        // If saved section is a portal but user lost auth for it, fallback to any active authenticated portal or home
        if (savedSection.includes('portal') && !savedSection.includes('login')) {
          if (hasStudent) return 'student-portal';
          if (hasAdmin) return 'admin-portal';
          if (hasTutor) return 'tutor-portal';
          if (hasParent) return 'parent-portal';
          if (hasProprietress) return 'proprietress-portal';
          return 'home';
        }

        return savedSection as PageSection;
      }

      // 4. If no section was explicitly saved, but user is authenticated, keep them in their portal!
      if (hasStudent) return 'student-portal';
      if (hasAdmin) return 'admin-portal';
      if (hasTutor) return 'tutor-portal';
      if (hasParent) return 'parent-portal';
      if (hasProprietress) return 'proprietress-portal';
    } catch { /* ignore */ }
    return 'home';
  });

  const setActiveSection = (section: PageSection) => {
    setActiveSectionState(section);
    try {
      localStorage.setItem('stanbax_active_section', section);
      sessionStorage.setItem('stanbax_active_section', section);
    } catch { /* ignore */ }
  };

  // 20. CBT Practice & Examination Engine
  const [cbtExams, setCbtExams] = useState<CbtExam[]>(() => {
    const saved = localStorage.getItem('stanbax_cbt_exams');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Error parsing cbt exams', e); }
    }
    return DEFAULT_CBT_EXAMS;
  });

  const [cbtAttempts, setCbtAttempts] = useState<CbtAttempt[]>(() => {
    const saved = localStorage.getItem('stanbax_cbt_attempts');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error('Error parsing cbt attempts', e); }
    }
    return DEFAULT_CBT_ATTEMPTS;
  });

  const addCbtExam = (examData: Omit<CbtExam, 'id'>): CbtExam => {
    const newExam: CbtExam = {
      ...examData,
      id: `cbt-${Date.now()}`
    };
    const updated = [newExam, ...cbtExams];
    setCbtExams(updated);
    localStorage.setItem('stanbax_cbt_exams', JSON.stringify(updated));
    return newExam;
  };

  const deleteCbtExam = (id: string) => {
    const updated = cbtExams.filter(e => e.id !== id);
    setCbtExams(updated);
    localStorage.setItem('stanbax_cbt_exams', JSON.stringify(updated));
  };

  const recordCbtAttempt = (attemptData: Omit<CbtAttempt, 'id' | 'dateAttempted'>): CbtAttempt => {
    const newAttempt: CbtAttempt = {
      ...attemptData,
      id: `att-${Date.now()}`,
      dateAttempted: new Date().toISOString()
    };
    const updated = [newAttempt, ...cbtAttempts];
    setCbtAttempts(updated);
    localStorage.setItem('stanbax_cbt_attempts', JSON.stringify(updated));
    return newAttempt;
  };

  // 21. Weekly Timetable & Bell Schedule
  const [timetables, setTimetables] = useState<ClassWeeklyTimetable[]>(() => {
    const saved = localStorage.getItem('stanbax_weekly_timetables');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Error parsing timetables', e); }
    }
    return DEFAULT_WEEKLY_TIMETABLES;
  });

  const updateClassTimetable = (classId: string, schedule: ClassWeeklyTimetable['schedule']) => {
    setTimetables(prev => {
      const existing = prev.find(t => t.classId === classId);
      const matchedClass = classes.find(c => c.id === classId);
      const updated = existing
        ? prev.map(t => t.classId === classId ? { ...t, schedule } : t)
        : [...prev, { classId, className: matchedClass?.name || classId, schedule }];
      localStorage.setItem('stanbax_weekly_timetables', JSON.stringify(updated));
      return updated;
    });
  };

  // 22. Medical & Clinic Sick-Bay
  const [sickBayLogs, setSickBayLogs] = useState<SickBayVisitLog[]>(() => {
    const saved = localStorage.getItem('stanbax_sickbay_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Error parsing sickbay logs', e); }
    }
    return DEFAULT_SICK_BAY_LOGS;
  });

  const addSickBayLog = (logData: Omit<SickBayVisitLog, 'id'>): SickBayVisitLog => {
    const newLog: SickBayVisitLog = {
      ...logData,
      id: `sb-${Date.now()}`
    };
    const updated = [newLog, ...sickBayLogs];
    setSickBayLogs(updated);
    localStorage.setItem('stanbax_sickbay_logs', JSON.stringify(updated));
    return newLog;
  };

  const updateSickBayLog = (id: string, updatedFields: Partial<SickBayVisitLog>) => {
    setSickBayLogs(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, ...updatedFields } : l);
      localStorage.setItem('stanbax_sickbay_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSickBayLog = (id: string) => {
    setSickBayLogs(prev => {
      const updated = prev.filter(l => l.id !== id);
      localStorage.setItem('stanbax_sickbay_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // 23. Parent Portal & Family Linkage
  const [parents, setParents] = useState<ParentProfile[]>(() => {
    const saved = localStorage.getItem('stanbax_parents_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Error parsing parents', e); }
    }
    return DEFAULT_PARENTS;
  });

  const [consultationRequests, setConsultationRequests] = useState<ParentConsultationRequest[]>(() => {
    const saved = localStorage.getItem('stanbax_parent_consultations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Error parsing consultations', e); }
    }
    return DEFAULT_PARENT_CONSULTATIONS;
  });

  const addParent = (parentData: Omit<ParentProfile, 'id'>) => {
    const newParent: ParentProfile = { ...parentData, id: `parent-${Date.now()}` };
    setParents(prev => {
      const updated = [...prev, newParent];
      try {
        localStorage.setItem('stanbax_parents_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    void remoteCreateCredential(
      (newParent.email || '').toLowerCase() || newParent.phone,
      newParent.password || 'parent2025',
      'parent',
      newParent.id,
      [newParent.phone, newParent.fullName.toLowerCase(), newParent.email].filter(Boolean)
    );
  };

  const updateParent = (id: string, updatedData: Partial<ParentProfile>) => {
    if (updatedData.password) {
      void remoteChangePassword(id, null, updatedData.password);
    }
    setParents(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updatedData } : p);
      try {
        localStorage.setItem('stanbax_parents_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteParent = (id: string) => {
    setParents(prev => {
      const updated = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('stanbax_parents_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const submitConsultationRequest = (reqData: Omit<ParentConsultationRequest, 'id' | 'createdAt' | 'status'>): ParentConsultationRequest => {
    const newReq: ParentConsultationRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newReq, ...consultationRequests];
    setConsultationRequests(updated);
    localStorage.setItem('stanbax_parent_consultations', JSON.stringify(updated));
    return newReq;
  };

  const updateConsultationStatus = (id: string, status: ParentConsultationRequest['status'], adminResponse?: string) => {
    setConsultationRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status, adminResponse: adminResponse !== undefined ? adminResponse : r.adminResponse } : r);
      localStorage.setItem('stanbax_parent_consultations', JSON.stringify(updated));
      return updated;
    });
  };

  const [feePayments, setFeePayments] = useState<FeePaymentRecord[]>(() => {
    const saved = localStorage.getItem('stanbax_fee_payments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Error parsing fee payments', e); }
    }
    return DEFAULT_FEE_PAYMENTS;
  });

  const recordFeePayment = (paymentData: Omit<FeePaymentRecord, 'id' | 'status'>): FeePaymentRecord => {
    const newRecord: FeePaymentRecord = {
      ...paymentData,
      id: `fee-${Date.now()}`,
      status: 'Pending Verification'
    };
    const updated = [newRecord, ...feePayments];
    setFeePayments(updated);
    localStorage.setItem('stanbax_fee_payments', JSON.stringify(updated));

    // Also credit student's fee profile if matched
    const studentToUpdate = students.find(s => s.id === paymentData.studentId || s.regNumber === paymentData.regNumber);
    if (studentToUpdate) {
      const classTuition = classes.find(c => c.id === studentToUpdate.classId)?.tuitionPerTerm
        ?? classes.find(c => c.name === studentToUpdate.grade)?.tuitionPerTerm;
      const currPaid = studentToUpdate.feePaid || 0;
      const currBal = studentToUpdate.feeBalance ?? classTuition ?? paymentData.amount;
      const newPaid = currPaid + paymentData.amount;
      const newBal = Math.max(0, currBal - paymentData.amount);
      const newStatus = newBal <= 0 ? 'Fully Paid' : 'Partially Paid';
      updateStudent(studentToUpdate.id, {
        feeTotal: studentToUpdate.feeTotal ?? classTuition,
        feePaid: newPaid,
        feeBalance: newBal,
        feeStatus: newStatus
      });
    }

    return newRecord;
  };

  const verifyFeePayment = (id: string, verifiedBy: string = 'Stanbax Bursary Clearance') => {
    setFeePayments(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status: 'Verified' as const, verifiedBy } : p);
      localStorage.setItem('stanbax_fee_payments', JSON.stringify(updated));
      return updated;
    });
  };

  const rejectFeePayment = (id: string, rejectedBy: string = 'Stanbax Bursary Clearance') => {
    let rejectedPayment: FeePaymentRecord | undefined;
    setFeePayments(prev => {
      const updated = prev.map(p => {
        if (p.id !== id) return p;
        rejectedPayment = p;
        return { ...p, status: 'Rejected' as const, rejectedBy };
      });
      try {
        localStorage.setItem('stanbax_fee_payments', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    // Restore the scholar's outstanding balance for a reversed payment
    if (rejectedPayment) {
      const { amount, studentId } = rejectedPayment;
      setStudents(prev => {
        const updated = prev.map(s => {
          if (s.id !== studentId) return s;
          const paid = Math.max(0, (s.feePaid ?? 0) - amount);
          const balance = (s.feeBalance ?? 0) + amount;
          return {
            ...s,
            feePaid: paid,
            feeBalance: balance,
            feeStatus: (paid <= 0 ? 'Outstanding' : 'Partially Paid') as StudentProfile['feeStatus']
          };
        });
        try {
          localStorage.setItem('stanbax_students', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  // 24. Digital Library & E-Textbooks
  const [libraryBooks, setLibraryBooks] = useState<LibraryBookItem[]>(() => {
    const saved = localStorage.getItem('stanbax_library_books');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Error parsing library books', e); }
    }
    return DEFAULT_LIBRARY_BOOKS;
  });

  const addLibraryBook = (bookData: Omit<LibraryBookItem, 'id' | 'downloadsCount'>): LibraryBookItem => {
    const newBook: LibraryBookItem = {
      ...bookData,
      id: `lib-${Date.now()}`,
      downloadsCount: 0
    };
    const updated = [newBook, ...libraryBooks];
    setLibraryBooks(updated);
    localStorage.setItem('stanbax_library_books', JSON.stringify(updated));
    return newBook;
  };

  const deleteLibraryBook = (id: string) => {
    setLibraryBooks(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem('stanbax_library_books', JSON.stringify(updated));
      return updated;
    });
  };

  const incrementBookDownload = (id: string) => {
    setLibraryBooks(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, downloadsCount: b.downloadsCount + 1 } : b);
      localStorage.setItem('stanbax_library_books', JSON.stringify(updated));
      return updated;
    });
  };

  // 25. Calvin AI Tokens State & Logic
  const INITIAL_CALVIN_TOKENS: CalvinToken[] = [
    {
      id: 'tok-1',
      code: 'CALVIN-REG-7D-8942',
      tier: 'regular',
      durationHours: 168,
      durationLabel: '7 Days Access',
      createdAt: '2026-09-20',
      createdBy: 'Super Administrator',
      status: 'unused',
      priceNgn: 1500
    },
    {
      id: 'tok-2',
      code: 'CALVIN-PREM-30D-4721',
      tier: 'premium',
      durationHours: 720,
      durationLabel: '30 Days Access (Premium)',
      createdAt: '2026-09-21',
      createdBy: 'Super Administrator',
      status: 'unused',
      priceNgn: 4500
    },
    {
      id: 'tok-3',
      code: 'CALVIN-PREM-TERM-9912',
      tier: 'premium',
      durationHours: 2160,
      durationLabel: '1 Academic Term (90 Days)',
      createdAt: '2026-09-22',
      createdBy: 'Super Administrator',
      status: 'unused',
      priceNgn: 10000
    },
    {
      id: 'tok-4',
      code: 'CALVIN-REG-24H-3104',
      tier: 'regular',
      durationHours: 24,
      durationLabel: '24 Hours Pass',
      createdAt: '2026-09-23',
      createdBy: 'Super Administrator',
      status: 'unused',
      priceNgn: 500
    }
  ];

  const [calvinTokens, setCalvinTokens] = useState<CalvinToken[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_calvin_tokens');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing calvin tokens', e);
    }
    return INITIAL_CALVIN_TOKENS;
  });

  const createCalvinTokens = (
    tier: 'regular' | 'premium',
    durationHours: number,
    count: number = 1,
    priceNgn?: number,
    customDurationLabel?: string
  ): CalvinToken[] => {
    const newTokens: CalvinToken[] = [];
    const durationLabel = customDurationLabel || (
      durationHours === 24 ? '24 Hours Pass' :
      durationHours === 168 ? '7 Days Access' :
      durationHours === 720 ? '30 Days Access' :
      durationHours === 2160 ? '1 Academic Term (90 Days)' :
      durationHours === 8760 ? '1 Full Academic Year' :
      `${Math.round(durationHours / 24)} Days Access`
    );

    for (let i = 0; i < count; i++) {
      const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const prefix = tier === 'premium' ? 'CALVIN-PREM' : 'CALVIN-REG';
      const durCode = durationHours >= 24 ? `${Math.round(durationHours / 24)}D` : `${durationHours}H`;
      const code = `${prefix}-${durCode}-${randomHex}${randomNum}`;

      newTokens.push({
        id: `tok-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        code,
        tier,
        durationHours,
        durationLabel,
        createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        createdBy: 'Super Administrator',
        status: 'unused',
        priceNgn: priceNgn || (tier === 'premium' ? (durationHours <= 24 ? 1000 : durationHours <= 168 ? 2500 : 6000) : (durationHours <= 24 ? 500 : durationHours <= 168 ? 1200 : 3000))
      });
    }

    const updated = [...newTokens, ...calvinTokens];
    setCalvinTokens(updated);
    try { localStorage.setItem('stanbax_calvin_tokens', JSON.stringify(updated)); } catch {}
    return newTokens;
  };

  const redeemCalvinToken = (
    studentId: string, 
    inputCode: string
  ): { success: boolean; message: string; tier?: 'regular' | 'premium'; expiresAt?: string } => {
    const cleanCode = inputCode.trim().toUpperCase();
    const token = calvinTokens.find(t => t.code.toUpperCase() === cleanCode);

    if (!token) {
      return { success: false, message: 'Invalid token code. Please check your token voucher and try again.' };
    }

    if (token.status === 'used' || token.status === 'expired') {
      return { 
        success: false, 
        message: `This token has already been redeemed by ${token.usedByStudentName || 'another student'} on ${token.activatedAt || 'an earlier date'}. Tokens cannot be used twice.` 
      };
    }

    const studentObj = students.find(s => s.id === studentId);
    const now = new Date();
    const expirationDate = new Date(now.getTime() + token.durationHours * 60 * 60 * 1000);
    const expiresAtStr = expirationDate.toISOString();
    const activatedAtStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Mark token as used (single-use enforcement)
    const updatedTokens = calvinTokens.map(t => {
      if (t.id === token.id) {
        return {
          ...t,
          status: 'used' as const,
          usedByStudentId: studentId,
          usedByStudentName: studentObj?.name || 'Student',
          activatedAt: activatedAtStr,
          expiresAt: expiresAtStr
        };
      }
      return t;
    });
    setCalvinTokens(updatedTokens);
    try { localStorage.setItem('stanbax_calvin_tokens', JSON.stringify(updatedTokens)); } catch {}

    // Update student's calvinAiAccess
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            calvinAiAccess: {
              active: true,
              tier: token.tier,
              tokenId: token.id,
              tokenCode: token.code,
              activatedAt: activatedAtStr,
              expiresAt: expiresAtStr,
              durationHours: token.durationHours,
              questionsCount: s.calvinAiAccess?.questionsCount || 0
            }
          };
        }
        return s;
      });
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });

    return {
      success: true,
      message: `Success! Activated ${token.tier === 'premium' ? 'Premium' : 'Regular'} Calvin AI access! Valid for ${token.durationLabel || token.durationHours + ' hours'}.`,
      tier: token.tier,
      expiresAt: expiresAtStr
    };
  };

  const revokeCalvinToken = (tokenId: string) => {
    setCalvinTokens(prev => {
      const updated = prev.map(t => t.id === tokenId ? { ...t, status: 'expired' as const } : t);
      try { localStorage.setItem('stanbax_calvin_tokens', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const grantDirectCalvinAccess = (studentId: string, tier: 'regular' | 'premium', durationHours: number) => {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
    const expiresAtStr = expirationDate.toISOString();
    const activatedAtStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            calvinAiAccess: {
              active: true,
              tier,
              tokenCode: `ADMIN-GRANT-${tier.toUpperCase()}`,
              activatedAt: activatedAtStr,
              expiresAt: expiresAtStr,
              durationHours,
              questionsCount: s.calvinAiAccess?.questionsCount || 0
            }
          };
        }
        return s;
      });
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const recordCalvinQuestionAsked = (studentId: string) => {
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId && s.calvinAiAccess) {
          return {
            ...s,
            calvinAiAccess: {
              ...s.calvinAiAccess,
              questionsCount: (s.calvinAiAccess.questionsCount || 0) + 1
            }
          };
        }
        return s;
      });
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const sendTokenActivationPrompt = (
    studentIds: string[], 
    options: { 
      tokenCode?: string; 
      tier?: 'regular' | 'premium'; 
      durationLabel?: string; 
      customMessage?: string; 
      autoAllocateToken?: boolean;
      durationHours?: number;
    }
  ) => {
    if (!studentIds || studentIds.length === 0) {
      return { success: false, count: 0, message: 'No scholars selected.' };
    }

    const tier = options.tier || 'regular';
    const durationHours = options.durationHours || 720; // 30 days default
    const durationLabel = options.durationLabel || (durationHours >= 720 ? `${Math.round(durationHours / 720)} Month(s)` : `${durationHours} Hours`);

    let allocatedCodes: string[] = [];
    if (options.autoAllocateToken) {
      const generated = createCalvinTokens(tier, durationHours, studentIds.length, 0, durationLabel);
      allocatedCodes = generated.map(g => g.code);
    } else if (options.tokenCode) {
      allocatedCodes = [options.tokenCode];
    }

    let modifiedCount = 0;
    setStudents(prev => {
      const updated = prev.map(s => {
        const targetIdx = studentIds.indexOf(s.id);
        if (targetIdx !== -1) {
          modifiedCount++;
          const assignedCode = allocatedCodes[targetIdx] || (allocatedCodes.length === 1 ? allocatedCodes[0] : undefined);
          const studentFirstName = s.name.split(' ')[0] || s.name;
          const defaultMsg = assignedCode 
            ? `Dear ${studentFirstName}, your Stanbax School Administrator has issued a ${tier === 'premium' ? 'Premium Masterclass' : 'Regular'} Calvin AI Token Voucher (${assignedCode}) for your ${s.grade || 'class'} syllabus. Tap below to activate your interactive study pass!`
            : `Dear ${studentFirstName}, you are prompted to activate your Calvin AI Academic Tutor pass for your ${s.grade || 'class'} studies. Please contact the School Bursary or Admin to obtain your voucher.`;

          return {
            ...s,
            tokenPrompt: {
              id: `prompt-${Date.now()}-${s.id}`,
              tokenCode: assignedCode,
              tier,
              durationLabel,
              message: options.customMessage?.trim() || defaultMsg,
              senderName: 'School Administrator',
              sentAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              status: 'pending' as const
            }
          };
        }
        return s;
      });
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });

    return {
      success: true,
      count: modifiedCount || studentIds.length,
      message: `Token activation prompt sent successfully to ${studentIds.length} scholar(s)!`
    };
  };

  const dismissTokenPrompt = (studentId: string) => {
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId && s.tokenPrompt) {
          return {
            ...s,
            tokenPrompt: {
              ...s.tokenPrompt,
              status: 'viewed' as const
            }
          };
        }
        return s;
      });
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const acceptTokenPromptAndActivate = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !student.tokenPrompt) {
      return { success: false, message: 'No pending token prompt found' };
    }

    if (student.tokenPrompt.tokenCode) {
      const result = redeemCalvinToken(studentId, student.tokenPrompt.tokenCode);
      if (result.success) {
        setStudents(prev => {
          const updated = prev.map(s => {
            if (s.id === studentId && s.tokenPrompt) {
              return {
                ...s,
                tokenPrompt: {
                  ...s.tokenPrompt,
                  status: 'activated' as const
                }
              };
            }
            return s;
          });
          try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
          return updated;
        });
        return result;
      } else {
        grantDirectCalvinAccess(studentId, student.tokenPrompt.tier || 'regular', 720);
        setStudents(prev => {
          const updated = prev.map(s => {
            if (s.id === studentId && s.tokenPrompt) {
              return {
                ...s,
                tokenPrompt: {
                  ...s.tokenPrompt,
                  status: 'activated' as const
                }
              };
            }
            return s;
          });
          try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
          return updated;
        });
        return { success: true, message: 'Token activated directly by Administrative Authority!', tier: student.tokenPrompt.tier };
      }
    } else {
      grantDirectCalvinAccess(studentId, student.tokenPrompt.tier || 'regular', 720);
      setStudents(prev => {
        const updated = prev.map(s => {
          if (s.id === studentId && s.tokenPrompt) {
            return {
              ...s,
              tokenPrompt: {
                ...s.tokenPrompt,
                status: 'activated' as const
              }
            };
          }
          return s;
        });
        try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
        return updated;
      });
      return { success: true, message: 'Token access activated successfully!', tier: student.tokenPrompt.tier };
    }
  };

  // 26. Staff Photo, Digital Signature & Principal Appointments
  const appointPrincipal = (tutorId: string, principalRole: PrincipalRole, privileges: PrincipalPrivilege[]) => {
    setTutors(prev => {
      const updated = prev.map(t => {
        if (t.id === tutorId) {
          return {
            ...t,
            principalRole,
            principalPrivileges: privileges,
            appointedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            appointedBy: 'Super Administrator'
          };
        }
        return t;
      });
      try { localStorage.setItem('stanbax_tutors', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const updateTutorPhotoAndSignature = (tutorId: string, data: { photoUrl?: string; signatureUrl?: string }) => {
    setTutors(prev => {
      const updated = prev.map(t => {
        if (t.id === tutorId) {
          return {
            ...t,
            ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl } : {}),
            ...(data.signatureUrl !== undefined ? { signatureUrl: data.signatureUrl } : {})
          };
        }
        return t;
      });
      try { localStorage.setItem('stanbax_tutors', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // 27. Subject Schemes of Work & AI Curriculum Grounding
  const [schemesOfWork, setSchemesOfWork] = useState<SchemeOfWork[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_schemes_of_work');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved schemes of work', e);
    }
    return defaultSchemesOfWork;
  });

  const addSchemeOfWork = (schemeData: Omit<SchemeOfWork, 'id' | 'lastUpdated'>): SchemeOfWork => {
    const newScheme: SchemeOfWork = {
      ...schemeData,
      id: `scheme-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      isAiLearned: true
    };
    setSchemesOfWork(prev => {
      const filtered = prev.filter(s => !(s.subjectName.toLowerCase() === newScheme.subjectName.toLowerCase() && s.classLevel === newScheme.classLevel && s.term === newScheme.term));
      const updated = [newScheme, ...filtered];
      try { localStorage.setItem('stanbax_schemes_of_work', JSON.stringify(updated)); } catch {}
      return updated;
    });
    return newScheme;
  };

  const updateSchemeOfWork = (id: string, updates: Partial<SchemeOfWork>) => {
    setSchemesOfWork(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            ...updates,
            lastUpdated: new Date().toISOString().split('T')[0],
            isAiLearned: true
          };
        }
        return s;
      });
      try { localStorage.setItem('stanbax_schemes_of_work', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const deleteSchemeOfWork = (id: string): boolean => {
    let deleted = false;
    setSchemesOfWork(prev => {
      const updated = prev.filter(s => {
        if (s.id === id) {
          deleted = true;
          return false;
        }
        return true;
      });
      try { localStorage.setItem('stanbax_schemes_of_work', JSON.stringify(updated)); } catch {}
      return updated;
    });
    return deleted;
  };

  const resetSchemesToDefault = () => {
    setSchemesOfWork(defaultSchemesOfWork);
    try { localStorage.setItem('stanbax_schemes_of_work', JSON.stringify(defaultSchemesOfWork)); } catch {}
  };

  const getSchemeForSubjectAndClass = (subjectName: string, classLevel?: string, term?: string): SchemeOfWork | undefined => {
    if (!subjectName) return undefined;
    const sName = subjectName.toLowerCase().trim();
    // 1. Exact match on subject name + class level + term
    let found = schemesOfWork.find(s => {
      const matchSubject = s.subjectName.toLowerCase() === sName || s.subjectName.toLowerCase().includes(sName) || sName.includes(s.subjectName.toLowerCase());
      const matchClass = !classLevel || s.classLevel.toLowerCase() === classLevel.toLowerCase() || s.classLevel === 'All Levels';
      const matchTerm = !term || s.term === term || s.term === 'All Terms';
      return matchSubject && matchClass && matchTerm;
    });

    if (found) return found;

    // 2. Fallback: match subject and class level regardless of term
    found = schemesOfWork.find(s => {
      const matchSubject = s.subjectName.toLowerCase() === sName || s.subjectName.toLowerCase().includes(sName) || sName.includes(s.subjectName.toLowerCase());
      const matchClass = !classLevel || s.classLevel.toLowerCase() === classLevel.toLowerCase() || s.classLevel === 'All Levels';
      return matchSubject && matchClass;
    });

    if (found) return found;

    // 3. Fallback: match subject name only
    return schemesOfWork.find(s => {
      return s.subjectName.toLowerCase() === sName || s.subjectName.toLowerCase().includes(sName) || sName.includes(s.subjectName.toLowerCase());
    });
  };

  // 28. School Community Chat System (Students, Parents, Tutors & Admin)
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_chat_channels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading chat channels', e);
    }
    return DEFAULT_CHAT_CHANNELS;
  });

  const [chatMessages, setChatMessages] = useState<SchoolChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading chat messages', e);
    }
    return DEFAULT_CHAT_MESSAGES;
  });

  const addChatChannel = (channelData: Omit<ChatChannel, 'id' | 'createdAt'>): ChatChannel => {
    const newChan: ChatChannel = {
      ...channelData,
      id: `chan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setChatChannels(prev => {
      const updated = [...prev, newChan];
      try { localStorage.setItem('stanbax_chat_channels', JSON.stringify(updated)); } catch {}
      return updated;
    });
    return newChan;
  };

  const updateChatChannel = (id: string, updates: Partial<ChatChannel>) => {
    setChatChannels(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      try { localStorage.setItem('stanbax_chat_channels', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const deleteChatChannel = (id: string) => {
    setChatChannels(prev => {
      const updated = prev.filter(c => c.id !== id);
      try { localStorage.setItem('stanbax_chat_channels', JSON.stringify(updated)); } catch {}
      return updated;
    });
    // Also remove messages belonging to deleted channel
    setChatMessages(prev => {
      const updated = prev.filter(m => m.channelId !== id);
      try { localStorage.setItem('stanbax_chat_messages', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const sendChatMessage = (msgData: Omit<SchoolChatMessage, 'id' | 'timestamp'>): SchoolChatMessage => {
    let resolvedBadge = msgData.senderBadge;
    if (!resolvedBadge && msgData.senderRole === 'student') {
      const studentObj = students.find(s => s.id === msgData.senderId);
      const chanObj = chatChannels.find(c => c.id === msgData.channelId);
      if (studentObj) {
        if (chanObj?.type === 'class') {
          const matchedClass = classes.find(c => c.id === chanObj.classId || c.name.toLowerCase() === chanObj.name.toLowerCase() || (chanObj.className && c.name.toLowerCase() === chanObj.className.toLowerCase()));
          if (matchedClass?.prefectStudentId === studentObj.id || studentObj.classLeadershipRole === 'prefect') {
            resolvedBadge = '⭐ Class Prefect';
          } else if (matchedClass?.assistantPrefectStudentId === studentObj.id || studentObj.classLeadershipRole === 'assistant_prefect') {
            resolvedBadge = '⭐ Assistant Class Prefect';
          } else if (studentObj.prefectRole) {
            resolvedBadge = `🏅 ${studentObj.prefectRole}`;
          }
        } else if (chanObj?.type === 'club') {
          const matchedClub = clubsList.find(c => c.id === chanObj.clubId || c.name.toLowerCase() === chanObj.name.toLowerCase() || (chanObj.clubName && c.name.toLowerCase() === chanObj.clubName.toLowerCase()));
          if (matchedClub?.presidentStudentId === studentObj.id || studentObj.clubLeadershipRoles?.[matchedClub?.id || ''] === 'president') {
            resolvedBadge = '👑 President';
          } else if (matchedClub?.vicePresidentStudentId === studentObj.id || studentObj.clubLeadershipRoles?.[matchedClub?.id || ''] === 'vice_president') {
            resolvedBadge = '⭐ Vice President';
          } else if (studentObj.prefectRole) {
            resolvedBadge = `🏅 ${studentObj.prefectRole}`;
          }
        } else if (studentObj.prefectRole) {
          resolvedBadge = `🏅 ${studentObj.prefectRole}`;
        }
      }
    }

    const newMsg: SchoolChatMessage = {
      ...msgData,
      senderBadge: resolvedBadge,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => {
      const updated = [...prev, newMsg];
      try { localStorage.setItem('stanbax_chat_messages', JSON.stringify(updated)); } catch {}
      return updated;
    });
    return newMsg;
  };

  const deleteChatMessage = (id: string) => {
    setChatMessages(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, deletedByAdmin: true } : m);
      try { localStorage.setItem('stanbax_chat_messages', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const flagChatMessage = (id: string, flagged: boolean = true) => {
    setChatMessages(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, flaggedByAdmin: flagged } : m);
      try { localStorage.setItem('stanbax_chat_messages', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const resetChatToDefault = () => {
    setChatChannels(DEFAULT_CHAT_CHANNELS);
    setChatMessages(DEFAULT_CHAT_MESSAGES);
    try {
      localStorage.setItem('stanbax_chat_channels', JSON.stringify(DEFAULT_CHAT_CHANNELS));
      localStorage.setItem('stanbax_chat_messages', JSON.stringify(DEFAULT_CHAT_MESSAGES));
    } catch {}
  };

  const toggleChatReaction = (messageId: string, emoji: string, userName: string) => {
    setChatMessages(prev => {
      const updated = prev.map(m => {
        if (m.id !== messageId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        const usersForEmoji = currentReactions[emoji] || [];
        const exists = usersForEmoji.includes(userName);
        if (exists) {
          const filtered = usersForEmoji.filter(u => u !== userName);
          if (filtered.length === 0) {
            delete currentReactions[emoji];
          } else {
            currentReactions[emoji] = filtered;
          }
        } else {
          currentReactions[emoji] = [...usersForEmoji, userName];
        }
        return { ...m, reactions: currentReactions };
      });
      try { localStorage.setItem('stanbax_chat_messages', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const togglePinChatMessage = (messageId: string, pinnedBy?: string) => {
    setChatMessages(prev => {
      const target = prev.find(m => m.id === messageId);
      if (!target) return prev;
      const willPin = !target.isPinned;
      const updated = prev.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            isPinned: willPin,
            pinnedBy: willPin ? (pinnedBy || 'Staff Administrator') : undefined,
            pinnedAt: willPin ? new Date().toISOString() : undefined
          };
        }
        // If pinning a message in this channel, unpin any other message in the channel so there's one highlighted pinned banner
        if (willPin && m.channelId === target.channelId && m.isPinned) {
          return { ...m, isPinned: false };
        }
        return m;
      });
      try { localStorage.setItem('stanbax_chat_messages', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // Last read timestamps per user & channel for live unread badges
  const [lastReadTimestamps, setLastReadTimestamps] = useState<{ [userKey: string]: { [channelId: string]: number } }>(() => {
    try {
      const saved = localStorage.getItem('stanbax_chat_read_timestamps');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed sensible initial last read to show 1-2 demo unread messages for initial excitement
    const initialSeed: { [channelId: string]: number } = {};
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    initialSeed['chan-gen-announcement'] = oneDayAgo;
    return { default: initialSeed, 'demo-student': initialSeed };
  });

  const markChannelAsRead = (channelId: string, userId: string) => {
    setLastReadTimestamps(prev => {
      const userKey = userId || 'default';
      const userObj = { ...(prev[userKey] || {}) };
      userObj[channelId] = Date.now();
      const updated = { ...prev, [userKey]: userObj };
      try { localStorage.setItem('stanbax_chat_read_timestamps', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const getChannelUnreadCount = (channelId: string, userId: string): number => {
    const userKey = userId || 'default';
    const userReads = lastReadTimestamps[userKey] || {};
    const lastRead = userReads[channelId] ?? (Date.now() - 48 * 60 * 60 * 1000); // default to 48 hours ago if never read
    
    return chatMessages.filter(m => {
      if (m.channelId !== channelId) return false;
      if (m.senderId === userId) return false;
      if (m.deletedByAdmin) return false;
      const msgTime = new Date(m.timestamp).getTime();
      return msgTime > lastRead;
    }).length;
  };

  const getTotalUnreadCount = (userId: string, authorizedChannelIds?: string[]): number => {
    const validChannels = authorizedChannelIds && authorizedChannelIds.length > 0 
      ? chatChannels.filter(c => authorizedChannelIds.includes(c.id))
      : chatChannels;

    return validChannels.reduce((sum, chan) => {
      return sum + getChannelUnreadCount(chan.id, userId);
    }, 0);
  };

  // Global floating chat drawer & popup state
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [activeFloatingChatChannelId, setActiveFloatingChatChannelId] = useState<string | null>(null);

  // 29. Campus Gallery Photos (Facilities & Events)
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_campus_gallery_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_GALLERY_PHOTOS;
  });

  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id' | 'uploadedAt'>) => {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setGalleryPhotos(prev => {
      const next = [newPhoto, ...prev];
      try {
        localStorage.setItem('stanbax_campus_gallery_photos', JSON.stringify(next));
      } catch (err) {
        console.warn('Storage error on gallery photo', err);
      }
      return next;
    });
  };

  const updateGalleryPhoto = (id: string, updates: Partial<GalleryPhoto>) => {
    setGalleryPhotos(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      try {
        localStorage.setItem('stanbax_campus_gallery_photos', JSON.stringify(next));
      } catch (err) {
        console.warn('Storage error updating photo', err);
      }
      return next;
    });
  };

  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos(prev => {
      const next = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('stanbax_campus_gallery_photos', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const resetGalleryPhotosToDefault = () => {
    setGalleryPhotos(DEFAULT_GALLERY_PHOTOS);
    try {
      localStorage.removeItem('stanbax_campus_gallery_photos');
    } catch {}
  };

  // 30. Prefects, Club Leaders & Ephemeral 16-Hour Statuses
  const assignClassPrefects = (classId: string, prefectStudentId?: string, assistantPrefectStudentId?: string) => {
    setClasses(prev => {
      const updated = prev.map(c => c.id === classId ? { ...c, prefectStudentId, assistantPrefectStudentId } : c);
      try { localStorage.setItem('stanbax_classes', JSON.stringify(updated)); } catch {}
      return updated;
    });

    setStudents(prev => {
      const targetClass = classes.find(c => c.id === classId);
      const updated = prev.map(s => {
        const inThisClass = s.classId === classId || (targetClass && s.grade.toLowerCase() === targetClass.name.toLowerCase());
        if (s.id === prefectStudentId) {
          return { ...s, classLeadershipRole: 'prefect' as const };
        }
        if (s.id === assistantPrefectStudentId) {
          return { ...s, classLeadershipRole: 'assistant_prefect' as const };
        }
        if (inThisClass && (s.classLeadershipRole === 'prefect' || s.classLeadershipRole === 'assistant_prefect')) {
          return { ...s, classLeadershipRole: null };
        }
        return s;
      });
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const assignClubLeaders = (
    clubId: string,
    presidentStudentId?: string,
    vicePresidentStudentId?: string,
    memberStudentIds?: string[]
  ) => {
    setClubsList(prev => {
      const updated = prev.map(c => c.id === clubId ? {
        ...c,
        presidentStudentId,
        vicePresidentStudentId,
        memberStudentIds: memberStudentIds || c.memberStudentIds || []
      } : c);
      try { localStorage.setItem('stanbax_clubs_list', JSON.stringify(updated)); } catch {}
      return updated;
    });

    const targetClub = clubsList.find(c => c.id === clubId);
    if (targetClub && (targetClub.name.toLowerCase().includes('press') || targetClub.name.toLowerCase().includes('media'))) {
      setPressClubPresidentStudentId(presidentStudentId);
      try {
        if (presidentStudentId) localStorage.setItem('stanbax_press_president', presidentStudentId);
        else localStorage.removeItem('stanbax_press_president');
      } catch {}
    }

    setStudents(prev => {
      const targetClub = clubsList.find(c => c.id === clubId);
      const clubName = targetClub?.name;
      const updated = prev.map(s => {
        let clubs = s.clubs ? [...s.clubs] : [];
        let leadership = { ...(s.clubLeadershipRoles || {}) };

        const isPresident = s.id === presidentStudentId;
        const isVice = s.id === vicePresidentStudentId;
        const isMember = memberStudentIds?.includes(s.id) || isPresident || isVice;

        if (clubName) {
          if (isMember && !clubs.includes(clubName)) {
            clubs.push(clubName);
          } else if (memberStudentIds && !isMember && clubs.includes(clubName)) {
            clubs = clubs.filter(cn => cn !== clubName);
          }
        }

        if (isPresident) {
          leadership[clubId] = 'president';
        } else if (isVice) {
          leadership[clubId] = 'vice_president';
        } else {
          delete leadership[clubId];
        }

        return { ...s, clubs, clubLeadershipRoles: leadership };
      });
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const assignStudentPrefectBadge = (studentId: string, prefectRole?: string, prefectBadge?: string) => {
    setStudents(prev => {
      const updated = prev.map(s => s.id === studentId ? {
        ...s,
        prefectRole: prefectRole || undefined,
        prefectBadge: prefectBadge || (prefectRole ? 'School Prefect' : undefined)
      } : s);
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const updateStudentChatSettings = (studentId: string, settings: { showOnlineStatus?: boolean; allowDirectMessages?: boolean; dmPermission?: 'classmates_only' | 'anyone' }) => {
    setStudents(prev => {
      const updated = prev.map(s => s.id === studentId ? {
        ...s,
        chatSettings: { ...(s.chatSettings || { showOnlineStatus: true, allowDirectMessages: true, dmPermission: 'anyone' }), ...settings }
      } : s);
      try { localStorage.setItem('stanbax_students', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const [ephemeralStatuses, setEphemeralStatuses] = useState<UserEphemeralStatus[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_ephemeral_statuses');
      if (saved) {
        const parsed = JSON.parse(saved);
        const active = cleanExpiredStatuses(parsed);
        return active.length > 0 ? active : cleanExpiredStatuses(INITIAL_EPHEMERAL_STATUSES);
      }
    } catch {}
    return cleanExpiredStatuses(INITIAL_EPHEMERAL_STATUSES);
  });

  // Purge expired statuses periodically every 60s
  useEffect(() => {
    const timer = setInterval(() => {
      setEphemeralStatuses(prev => {
        const active = cleanExpiredStatuses(prev);
        if (active.length !== prev.length) {
          try { localStorage.setItem('stanbax_ephemeral_statuses', JSON.stringify(active)); } catch {}
        }
        return active;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const postEphemeralStatus = (statusData: Omit<UserEphemeralStatus, 'id' | 'createdAt' | 'expiresAt' | 'views'>) => {
    const newStatus = create16HourStatus(statusData);
    setEphemeralStatuses(prev => {
      const active = cleanExpiredStatuses([newStatus, ...prev]);
      try { localStorage.setItem('stanbax_ephemeral_statuses', JSON.stringify(active)); } catch {}
      return active;
    });
  };

  const deleteEphemeralStatus = (id: string) => {
    setEphemeralStatuses(prev => {
      const updated = prev.filter(s => s.id !== id);
      try { localStorage.setItem('stanbax_ephemeral_statuses', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const markEphemeralStatusViewed = (statusId: string, viewerId: string, viewerName?: string, viewerRole?: string) => {
    setEphemeralStatuses(prev => {
      const updated = prev.map(s => {
        if (s.id === statusId) {
          const views = s.views || [];
          const viewRecords = s.viewRecords || [];
          if (!views.includes(viewerId)) {
            const newRecord: StatusViewerRecord = {
              userId: viewerId,
              userName: viewerName || 'School Scholar',
              userRole: viewerRole || 'student',
              viewedAt: new Date().toISOString()
            };
            return {
              ...s,
              views: [...views, viewerId],
              viewRecords: [...viewRecords, newRecord]
            };
          }
        }
        return s;
      });
      try { localStorage.setItem('stanbax_ephemeral_statuses', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // 31. School News & Blog System (Managed by Press Club President & Nominated Editors)
  const [newsArticles, setNewsArticles] = useState<SchoolNewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_news_articles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NEWS_ARTICLES;
  });

  const [pressClubPresidentStudentId, setPressClubPresidentStudentId] = useState<string | undefined>(() => {
    try {
      const saved = localStorage.getItem('stanbax_press_president');
      if (saved) return saved;
    } catch {}
    return 'stu-1'; // Default: Tiwa Adeleke
  });

  const [pressClubEditorStudentIds, setPressClubEditorStudentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_press_editors');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['stu-2', 'stu-3']; // Default editors: Babatunde Akindele, Chinedu Eze
  });

  const addNewsArticle = (article: Omit<SchoolNewsArticle, 'id' | 'publishedAt'>) => {
    const newArt: SchoolNewsArticle = {
      ...article,
      id: `news-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      publishedAt: new Date().toISOString(),
      likesCount: 0,
      viewsCount: 1
    };
    setNewsArticles(prev => {
      const updated = [newArt, ...prev];
      try { localStorage.setItem('stanbax_news_articles', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const updateNewsArticle = (id: string, updates: Partial<SchoolNewsArticle>) => {
    setNewsArticles(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...updates } : a);
      try { localStorage.setItem('stanbax_news_articles', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const deleteNewsArticle = (id: string) => {
    setNewsArticles(prev => {
      const updated = prev.filter(a => a.id !== id);
      try { localStorage.setItem('stanbax_news_articles', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const likeNewsArticle = (id: string) => {
    setNewsArticles(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, likesCount: (a.likesCount || 0) + 1 } : a);
      try { localStorage.setItem('stanbax_news_articles', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const assignPressClubPresident = (studentId: string | undefined) => {
    setPressClubPresidentStudentId(studentId);
    try {
      if (studentId) localStorage.setItem('stanbax_press_president', studentId);
      else localStorage.removeItem('stanbax_press_president');
    } catch {}
  };

  const nominatePressClubEditor = (studentId: string) => {
    setPressClubEditorStudentIds(prev => {
      if (prev.includes(studentId)) return prev;
      const updated = [...prev, studentId];
      try { localStorage.setItem('stanbax_press_editors', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const removePressClubEditor = (studentId: string) => {
    setPressClubEditorStudentIds(prev => {
      const updated = prev.filter(id => id !== studentId);
      try { localStorage.setItem('stanbax_press_editors', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const resetNewsArticlesToDefault = () => {
    setNewsArticles(DEFAULT_NEWS_ARTICLES);
    setPressClubPresidentStudentId('stu-1');
    setPressClubEditorStudentIds(['stu-2', 'stu-3']);
    try {
      localStorage.setItem('stanbax_news_articles', JSON.stringify(DEFAULT_NEWS_ARTICLES));
      localStorage.setItem('stanbax_press_president', 'stu-1');
      localStorage.setItem('stanbax_press_editors', JSON.stringify(['stu-2', 'stu-3']));
    } catch {}
  };

  // Student Article Submissions ("Letters to the Editor")
  const [studentSubmissions, setStudentSubmissions] = useState<StudentArticleSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_student_submissions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'sub-sample-1',
        studentId: 'stu-3',
        studentName: 'Chinedu Eze',
        studentGrade: 'SSS 1 Commercial',
        title: 'Why Robotics and Financial Literacy Should Be Taught in Junior Classes',
        category: 'STEM & Innovation',
        content: 'As young scholars navigating the 21st century, understanding both algorithmic problem solving and financial discipline prepares us for tertiary scholarship and entrepreneurial ventures. Our JETS club experience proves that even early secondary students can build functional hardware prototypes and understand economic value creation.',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      }
    ];
  });

  const submitArticleForReview = (submission: Omit<StudentArticleSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: StudentArticleSubmission = {
      ...submission,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    setStudentSubmissions(prev => {
      const updated = [newSub, ...prev];
      try { localStorage.setItem('stanbax_student_submissions', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const reviewStudentSubmission = (id: string, decision: 'approved' | 'rejected', reason?: string) => {
    setStudentSubmissions(prev => {
      const target = prev.find(s => s.id === id);
      if (target && decision === 'approved') {
        addNewsArticle({
          title: target.title,
          slug: target.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
          category: target.category,
          excerpt: target.content.slice(0, 140) + '...',
          content: target.content,
          coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
          readTime: `${Math.max(2, Math.round(target.content.split(' ').length / 180))} min read`,
          tags: ['Student Voice', 'Letters to Editor', target.category],
          isFeatured: false,
          author: {
            id: target.studentId,
            name: target.studentName,
            role: 'Press Club Editor',
            gradeOrTitle: target.studentGrade
          },
          likesCount: 1,
          viewsCount: 1
        });
      }
      const updated = prev.map(s => s.id === id ? { ...s, status: decision, rejectionReason: reason } : s);
      try { localStorage.setItem('stanbax_student_submissions', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // 32. School Representative & Landing Page Visitor Inquiries
  const [schoolRepConfig, setSchoolRepConfig] = useState<SchoolRepConfig>(() => {
    try {
      const saved = localStorage.getItem('stanbax_school_rep_config');
      if (saved) {
        return { ...DEFAULT_SCHOOL_REP_CONFIG, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_SCHOOL_REP_CONFIG;
  });

  const updateSchoolRepConfig = (updates: Partial<SchoolRepConfig>) => {
    setSchoolRepConfig(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('stanbax_school_rep_config', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch {}
      return updated;
    });
  };

  const toggleRepAvailability = (available?: boolean) => {
    setSchoolRepConfig(prev => {
      const newAvail = available !== undefined ? available : !prev.isAvailable;
      const updated = {
        ...prev,
        isAvailable: newAvail,
        statusText: newAvail 
          ? 'Online Now • Available for Live Consultation'
          : 'Away on Campus Inspection • Calvin AI Virtual Rep Active'
      };
      try {
        localStorage.setItem('stanbax_school_rep_config', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch {}
      return updated;
    });
  };

  const [visitorConversations, setVisitorConversations] = useState<VisitorConversation[]>(() => {
    try {
      const saved = localStorage.getItem('stanbax_visitor_conversations');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_VISITOR_CONVERSATIONS;
  });

  // Real-time typing indicators registry (conversationId -> typing state)
  const [typingMap, setTypingMap] = useState<Record<string, { isRepTyping?: boolean; repName?: string; isVisitorTyping?: boolean; visitorName?: string }>>(() => {
    try {
      const saved = localStorage.getItem('stanbax_chat_typing');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Cross-tab synchronization for visitor conversations and real-time typing indicators
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'stanbax_visitor_conversations') {
        try {
          const val = localStorage.getItem('stanbax_visitor_conversations');
          if (val) setVisitorConversations(JSON.parse(val));
        } catch {}
      }
      if (e.key === 'stanbax_chat_typing') {
        try {
          const val = localStorage.getItem('stanbax_chat_typing');
          if (val) setTypingMap(JSON.parse(val));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  const safeSaveConversations = (conversations: VisitorConversation[]) => {
    try {
      localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(conversations));
      window.dispatchEvent(new Event('storage'));
    } catch (err: any) {
      if (err?.name === 'QuotaExceededError' || err?.code === 22) {
        console.warn('LocalStorage quota limit reached, trimming legacy caches...');
        try {
          localStorage.removeItem('stanbax_chat_drafts');
          localStorage.removeItem('stanbax_cached_audio');
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(conversations));
          window.dispatchEvent(new Event('storage'));
        } catch {}
      }
    }
  };

  const setChatTyping = async (visitorId: string, sender: 'representative' | 'visitor', isTyping: boolean, senderName?: string) => {
    if (!visitorId) return;
    setTypingMap(prev => {
      const current = prev[visitorId] || {};
      const updated = {
        ...current,
        ...(sender === 'representative'
          ? { isRepTyping: isTyping, repName: isTyping ? (senderName || schoolRepConfig.repName) : undefined }
          : { isVisitorTyping: isTyping, visitorName: isTyping ? senderName : undefined })
      };
      const nextMap = { ...prev, [visitorId]: updated };
      try {
        localStorage.setItem('stanbax_chat_typing', JSON.stringify(nextMap));
        window.dispatchEvent(new Event('storage'));
      } catch {}
      return nextMap;
    });

    try {
      void fetch('/api/chat-typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: visitorId,
          sender,
          senderName: senderName || (sender === 'representative' ? schoolRepConfig.repName : 'Visitor'),
          isTyping
        })
      });
    } catch {}
  };

  // Cross-tab synchronization for visitor inquiries, representative status, and typing indicators
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'stanbax_visitor_conversations' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setVisitorConversations(parsed);
          }
        } catch {}
      }
      if (e.key === 'stanbax_school_rep_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setSchoolRepConfig(prev => ({ ...prev, ...parsed }));
          }
        } catch {}
      }
      if (e.key === 'stanbax_chat_typing' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setTypingMap(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  const sendVisitorMessage = async (
    visitorId: string,
    messageText: string,
    visitorInfo?: { name?: string; phone?: string; email?: string; category?: any; language?: string },
    attachment?: { url: string; name: string; type: 'image' | 'document' | 'audio'; audioDuration?: number }
  ): Promise<VisitorChatMessage | null> => {
    const text = messageText.trim();
    if (!text && !attachment) return null;

    // Clear typing status on send
    void setChatTyping(visitorId, 'visitor', false);

    const now = new Date().toISOString();
    const userMsg: VisitorChatMessage = {
      id: `vmsg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'visitor',
      senderName: visitorInfo?.name || 'Visitor',
      content: text || (attachment?.type === 'audio' ? '🎤 Voice message' : '📎 Attachment shared'),
      timestamp: now,
      status: 'delivered',
      deliveredAt: now,
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type,
      audioDuration: attachment?.audioDuration
    };

    const existingConv = visitorConversations.find(c => c.visitorId === visitorId);
    const effectiveVisitorName = visitorInfo?.name || existingConv?.visitorName || `Prospective Parent (${Math.floor(1000 + Math.random() * 9000)})`;
    const historyPayload = existingConv?.messages 
      ? existingConv.messages.map((m: VisitorChatMessage) => ({ sender: m.sender, content: m.content })) 
      : [];

    setVisitorConversations(prev => {
      const existingIdx = prev.findIndex(c => c.visitorId === visitorId);

      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const updatedMessages = [...existing.messages, userMsg];
        const updated: VisitorConversation = {
          ...existing,
          visitorName: effectiveVisitorName,
          visitorPhone: visitorInfo?.phone || existing.visitorPhone,
          visitorEmail: visitorInfo?.email || existing.visitorEmail,
          lastMessageAt: now,
          unreadByAdmin: true,
          status: 'waiting_rep',
          messages: updatedMessages
        };
        const copy = [...prev];
        copy[existingIdx] = updated;
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      } else {
        const newConv: VisitorConversation = {
          visitorId,
          visitorName: effectiveVisitorName,
          visitorPhone: visitorInfo?.phone,
          visitorEmail: visitorInfo?.email,
          visitorCategory: visitorInfo?.category || 'Prospective Parent',
          createdAt: now,
          lastMessageAt: now,
          status: 'waiting_rep',
          unreadByAdmin: true,
          messages: [userMsg]
        };
        const copy = [newConv, ...prev];
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      }
    });

    // If representative is not available (or offline), Calvin AI steps in as the virtual representative!
    if (!schoolRepConfig.isAvailable) {
      try {
        const res = await fetch('/api/visitor-rep-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            visitorName: effectiveVisitorName,
            repName: schoolRepConfig.repName,
            repTitle: schoolRepConfig.repTitle,
            repRole: schoolRepConfig.activeRole,
            language: visitorInfo?.language || 'en',
            chatHistory: historyPayload
          })
        });

        const data = await res.json();
        const replyText = data?.reply || "Thank you for contacting Stanbax Schools Ibadan! Your inquiry has been received and our school representative will review and respond promptly.";

        const aiMsgNow = new Date().toISOString();
        const aiMsg: VisitorChatMessage = {
          id: `aimsg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          sender: 'calvin_ai',
          senderName: 'Calvin AI (Virtual Rep)',
          senderTitle: `Assisting for ${schoolRepConfig.repName}`,
          content: replyText,
          timestamp: aiMsgNow,
          isAiResponse: true,
          status: 'delivered',
          deliveredAt: aiMsgNow
        };

        setVisitorConversations(prev => {
          const idx = prev.findIndex(c => c.visitorId === visitorId);
          if (idx >= 0) {
            const existing = prev[idx];
            const updated = {
              ...existing,
              lastMessageAt: new Date().toISOString(),
              messages: [...existing.messages, aiMsg]
            };
            const copy = [...prev];
            copy[idx] = updated;
            try {
              localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
              window.dispatchEvent(new Event('storage'));
            } catch {}
            return copy;
          }
          return prev;
        });

        return aiMsg;
      } catch (err) {
        console.warn('Calvin AI virtual rep fetch error:', err);
      }
    }

    return null;
  };

  // Instant Calvin AI stand-in if representative is online but busy
  const requestCalvinAiInstantReply = async (visitorId: string): Promise<VisitorChatMessage | null> => {
    const existingConv = visitorConversations.find(c => c.visitorId === visitorId);
    if (!existingConv || existingConv.messages.length === 0) return null;
    const lastUserMsg = [...existingConv.messages].reverse().find(m => m.sender === 'visitor');
    if (!lastUserMsg) return null;

    const historyPayload = existingConv.messages.map(m => ({ sender: m.sender, content: m.content }));
    try {
      const res = await fetch('/api/visitor-rep-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: lastUserMsg.content,
          visitorName: existingConv.visitorName,
          repName: schoolRepConfig.repName,
          repTitle: schoolRepConfig.repTitle,
          repRole: schoolRepConfig.activeRole,
          chatHistory: historyPayload
        })
      });

      const data = await res.json();
      const replyText = data?.reply || `Thank you for contacting Stanbax Schools! Your query has been noted and ${schoolRepConfig.repName} will reply shortly.`;

      const aiMsgNow = new Date().toISOString();
      const aiMsg: VisitorChatMessage = {
        id: `aimsg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: 'calvin_ai',
        senderName: 'Calvin AI (Virtual Rep)',
        senderTitle: `Assisting for ${schoolRepConfig.repName}`,
        content: replyText,
        timestamp: aiMsgNow,
        isAiResponse: true,
        status: 'delivered',
        deliveredAt: aiMsgNow
      };

      setVisitorConversations(prev => {
        const idx = prev.findIndex(c => c.visitorId === visitorId);
        if (idx >= 0) {
          const existing = prev[idx];
          const updated = {
            ...existing,
            lastMessageAt: new Date().toISOString(),
            messages: [...existing.messages, aiMsg]
          };
          const copy = [...prev];
          copy[idx] = updated;
          try {
            localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
            window.dispatchEvent(new Event('storage'));
          } catch {}
          return copy;
        }
        return prev;
      });

      return aiMsg;
    } catch (err) {
      console.warn('Error fetching Calvin AI instant reply:', err);
      return null;
    }
  };

  const replyAsRepresentative = (
    visitorId: string,
    replyContent: string,
    repInfo?: { name?: string; title?: string },
    attachment?: { url: string; name: string; type: 'image' | 'document' | 'audio'; audioDuration?: number }
  ) => {
    const text = replyContent.trim();
    if (!text && !attachment) return;

    // Clear typing status on send
    void setChatTyping(visitorId, 'representative', false);

    const now = new Date().toISOString();
    const repMsg: VisitorChatMessage = {
      id: `repmsg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'representative',
      senderName: repInfo?.name || schoolRepConfig.repName,
      senderTitle: repInfo?.title || schoolRepConfig.repTitle,
      senderAvatar: schoolRepConfig.repAvatar,
      content: text || (attachment?.type === 'audio' ? '🎤 Representative Voice Memo' : '📎 Document Attached'),
      timestamp: now,
      status: 'delivered',
      deliveredAt: now,
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type,
      audioDuration: attachment?.audioDuration
    };

    setVisitorConversations(prev => {
      const idx = prev.findIndex(c => c.visitorId === visitorId);
      if (idx >= 0) {
        const existing = prev[idx];
        const updated = {
          ...existing,
          status: 'resolved' as const,
          unreadByAdmin: false,
          unreadByVisitor: true,
          lastMessageAt: now,
          messages: [...existing.messages, repMsg]
        };
        const copy = [...prev];
        copy[idx] = updated;
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      }
      return prev;
    });
  };

  // 1. Admissions Screening & Consultation Appointment Booking inside Chat
  const bookChatAppointment = async (
    visitorId: string,
    data: Omit<ChatAppointment, 'id' | 'createdAt' | 'status'>
  ): Promise<ChatAppointment> => {
    const now = new Date().toISOString();
    const newAppointment: ChatAppointment = {
      ...data,
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'confirmed',
      createdAt: now
    };

    // Auto-sync into School Academic Calendar
    try {
      addCalendarEvent({
        title: `Screening/Visit: ${data.type} (${data.candidateName})`,
        date: data.date,
        category: 'Meeting',
        description: `Scheduled slot: ${data.timeSlot} • Candidate: ${data.candidateName} • Parent contact: ${data.parentPhone}. Notes: ${data.notes || 'None'}`
      });
    } catch {}

    const apptMsg: VisitorChatMessage = {
      id: `msg-apt-${Date.now()}`,
      sender: 'representative',
      senderName: schoolRepConfig.repName,
      senderTitle: schoolRepConfig.repTitle,
      content: `🎉 Official Appointment Confirmed: ${data.type} for candidate ${data.candidateName} on ${new Date(data.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${data.timeSlot}. A calendar appointment has been logged with our admissions desk.`,
      timestamp: now,
      status: 'delivered',
      deliveredAt: now,
      isAppointmentNotice: true,
      appointmentData: newAppointment
    };

    setVisitorConversations(prev => {
      const idx = prev.findIndex(c => c.visitorId === visitorId);
      if (idx >= 0) {
        const conv = prev[idx];
        const updatedAppointments = [...(conv.appointments || []), newAppointment];
        const updatedMessages = [...conv.messages, apptMsg];
        const copy = [...prev];
        copy[idx] = {
          ...conv,
          appointments: updatedAppointments,
          messages: updatedMessages,
          visitorPhone: data.parentPhone || conv.visitorPhone,
          visitorEmail: data.parentEmail || conv.visitorEmail,
          lastMessageAt: now
        };
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      }
      return prev;
    });

    return newAppointment;
  };

  // 4. Multi-Representative Department Hand-Off & Routing
  const transferConversationDepartment = (
    visitorId: string,
    targetRole: SchoolRepRole,
    targetRepName: string,
    targetRepTitle: string,
    reason?: string
  ) => {
    const now = new Date().toISOString();
    const existing = visitorConversations.find(c => c.visitorId === visitorId);
    const currentRole = existing?.assignedRole || schoolRepConfig.activeRole;

    const record: ChatTransferRecord = {
      fromRole: currentRole,
      toRole: targetRole,
      transferredBy: schoolRepConfig.repName,
      targetRepName,
      targetRepTitle,
      reason,
      timestamp: now
    };

    const transferMsg: VisitorChatMessage = {
      id: `transfer-${Date.now()}`,
      sender: 'representative',
      senderName: targetRepName,
      senderTitle: targetRepTitle,
      content: `🔄 Department Hand-Off: Inquiry transferred to ${targetRepName} (${targetRepTitle})${reason ? ` • Transfer Reason: "${reason}"` : ''}. All conversation history and submitted documents have been routed to the active desk.`,
      timestamp: now,
      status: 'delivered',
      deliveredAt: now,
      isTransferNotice: true,
      transferData: record
    };

    setVisitorConversations(prev => {
      const idx = prev.findIndex(c => c.visitorId === visitorId);
      if (idx >= 0) {
        const conv = prev[idx];
        const copy = [...prev];
        copy[idx] = {
          ...conv,
          assignedRole: targetRole,
          assignedRepName: targetRepName,
          assignedRepTitle: targetRepTitle,
          transferHistory: [...(conv.transferHistory || []), record],
          messages: [...conv.messages, transferMsg],
          lastMessageAt: now,
          status: 'waiting_rep',
          unreadByAdmin: true
        };
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      }
      return prev;
    });
  };

  // 5. Visitor WhatsApp/SMS Notification Opt-in
  const updateVisitorNotificationOptIn = (
    visitorId: string,
    optIn: { whatsapp?: boolean; sms?: boolean; phone?: string; email?: string }
  ) => {
    setVisitorConversations(prev => {
      const idx = prev.findIndex(c => c.visitorId === visitorId);
      if (idx >= 0) {
        const conv = prev[idx];
        const copy = [...prev];
        copy[idx] = {
          ...conv,
          visitorPhone: optIn.phone || conv.visitorPhone,
          visitorEmail: optIn.email || conv.visitorEmail,
          notificationOptIn: {
            ...conv.notificationOptIn,
            ...optIn
          }
        };
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      }
      return prev;
    });
  };

  const markVisitorConversationRead = (visitorId: string) => {
    setVisitorConversations(prev => {
      const idx = prev.findIndex(c => c.visitorId === visitorId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], unreadByAdmin: false };
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      }
      return prev;
    });
  };

  // Mark all visitor queries in this conversation as seen & acknowledged by the school representative
  const markConversationSeenByAdmin = (visitorId: string) => {
    const now = new Date().toISOString();
    setVisitorConversations(prev => {
      const idx = prev.findIndex(c => c.visitorId === visitorId);
      if (idx >= 0) {
        const conv = prev[idx];
        let changed = false;
        const updatedMessages = conv.messages.map(m => {
          if (m.sender === 'visitor' && m.status !== 'seen') {
            changed = true;
            return {
              ...m,
              status: 'seen' as const,
              seenAt: m.seenAt || now
            };
          }
          return m;
        });

        if (!changed && !conv.unreadByAdmin) return prev;

        const updated: VisitorConversation = {
          ...conv,
          unreadByAdmin: false,
          lastSeenByAdminAt: now,
          messages: updatedMessages
        };
        const copy = [...prev];
        copy[idx] = updated;
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      }
      return prev;
    });

    try {
      void fetch('/api/chat-delivery/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: visitorId,
          role: 'representative',
          name: schoolRepConfig.repName,
          lastSeenAt: now
        })
      });
    } catch {}
  };

  // Mark all representative/Calvin AI responses in this conversation as seen by the visitor/user
  const markConversationSeenByVisitor = (visitorId: string) => {
    const now = new Date().toISOString();
    setVisitorConversations(prev => {
      const idx = prev.findIndex(c => c.visitorId === visitorId);
      if (idx >= 0) {
        const conv = prev[idx];
        let changed = false;
        const updatedMessages = conv.messages.map(m => {
          if ((m.sender === 'representative' || m.sender === 'calvin_ai') && m.status !== 'seen') {
            changed = true;
            return {
              ...m,
              status: 'seen' as const,
              seenAt: m.seenAt || now
            };
          }
          return m;
        });

        if (!changed && !conv.unreadByVisitor) return prev;

        const updated: VisitorConversation = {
          ...conv,
          unreadByVisitor: false,
          lastSeenByVisitorAt: now,
          messages: updatedMessages
        };
        const copy = [...prev];
        copy[idx] = updated;
        try {
          localStorage.setItem('stanbax_visitor_conversations', JSON.stringify(copy));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        return copy;
      }
      return prev;
    });

    try {
      void fetch('/api/chat-delivery/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: visitorId,
          role: 'visitor',
          lastSeenAt: now
        })
      });
    } catch {}
  };

  const getVisitorConversation = (visitorId: string) => {
    return visitorConversations.find(c => c.visitorId === visitorId);
  };

  // 15B. Dynamic Available Academic Sessions across current & archives
  const availableSessions = Array.from(new Set([
    assessmentConfig.activeSession,
    '2025/2026 Academic Session',
    ...(student?.academicHistory?.map(h => h.sessionName) || []),
    '2024/2025 Academic Session',
    '2023/2024 Academic Session'
  ])).filter(Boolean);

  return (
    <SchoolContext.Provider
      value={{
        images,
        updateImage,
        resetImagesToDefault,
        schoolInfo,
        updateSchoolInfo,
        resetSchoolInfo,
        resetSchoolInfoToDefault: resetSchoolInfo,
        updateSchoolStats,
        resetSchoolStatsToDefault,
        proprietressProfile,
        updateProprietressProfile,
        resetProprietressProfileToDefault,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        messagesToProprietress,
        sendMessageToProprietress,
        updateProprietressMessageStatus,
        deleteProprietressMessage,
        directives,
        addDirective,
        updateDirective,
        deleteDirective,
        resetDirectivesToDefault,
        facultyList,
        addFacultyMember,
        updateFacultyMember,
        deleteFacultyMember,
        resetFacultyToDefault,
        classes,
        addClass,
        updateClass,
        deleteClass,
        resetClassesToDefault,
        assignClassTeacher,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        resetSubjectsToDefault,
        gradingSystem,
        gradingRules: gradingSystem,
        updateGradingRule,
        addGradingRule,
        deleteGradingRule,
        resetGradingSystem,
        resetGradingToDefault: resetGradingSystem,
        calculateGrade,
        tutors,
        tutor,
        activeTutorId,
        setActiveTutorId,
        switchActiveTutor: (id: string) => setActiveTutorId(id),
        assignSubjectsToTutor: (tutorId: string, subjList: string[]) => {
          updateTutor(tutorId, { assignedSubjects: subjList });
        },
        updateTutor,
        addTutor,
        deleteTutor,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        applications,
        submitApplication,
        updateApplicationStatus,
        updateApplicationExamDetails,
        entranceExamSettings,
        updateEntranceExamSettings,
        resetEntranceExamSettings,
        broadcastLogs,
        addBroadcastLog,
        students,
        student,
        activeStudentId,
        setActiveStudentId,
        switchActiveStudent,
        updateStudent,
        registerStudent,
        updateStudentPassport,
        deleteStudent,
        homeworks,
        toggleHomeworkStatus,
        addHomework,
        deleteHomework,
        grades,
        updateGrade,
        getStudentGrades,
        assessmentConfig,
        updateAssessmentConfig,
        setActiveAssessmentPhase,
        setActiveAssessmentTerm,
        setPromotionPassMark,
        availableSessions,
        startNewAcademicSession,
        resetAssessmentToDefault,
        getNextClass,
        toggleAutoRanking,
        getClassRankings,
        inquiries,
        submitInquiry,
        isAdminAuthenticated,
        isProprietressAuthenticated,
        isHeadmistressAuthenticated,
        isModeratorAuthenticated,
        isStudentAuthenticated,
        isTutorAuthenticated,
        authenticatedRole,
        universalLogin,
        loginAdmin,
        logoutAdmin,
        loginProprietress,
        logoutProprietress,
        loginHeadmistress,
        logoutHeadmistress,
        loginModerator,
        logoutModerator,
        loginStudent,
        logoutStudent,
        loginTutor,
        logoutTutor,
        logoutAll,
        toggleStudentAlumni,
        upgradeStudentToTutor,
        completeTutorProfile,
        createTutorAccount,
        changePassword,
        forgotPasswordReset,
        getSecurityQuestionForUser,
        resetPasswordWithSecurityAnswer,
        getAllUserCredentials,
        adminResetUserPassword,
        adminSecurityQuestion,
        adminSecurityAnswer,
        updateAdminSecurityQuestion,
        lessonNotes,
        notesFeatureEnabled,
        addLessonNote,
        deleteLessonNote,
        toggleNotesFeature,
        deleteTermNotes,
        exportNotesZip,
        incrementNoteDownload,
        activeSection,
        setActiveSection,
        // 16. Landing Page CMS
        heroSlides,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        resetHeroSlidesToDefault,
        heroHighlights,
        updateHeroHighlights,
        resetHeroHighlightsToDefault,
        keyPillars,
        keyPillarsHeader,
        updateKeyPillar,
        addKeyPillar,
        deleteKeyPillar,
        updateKeyPillarsHeader,
        resetKeyPillarsToDefault,
        aboutContent,
        updateAboutContent,
        resetAboutContentToDefault,
        resetAboutContent: resetAboutContentToDefault,
        academicPrograms,
        updateAcademicProgram,
        addAcademicProgram,
        deleteAcademicProgram,
        resetAcademicProgramsToDefault,
        featuredCourses,
        updateFeaturedCourse,
        addFeaturedCourse,
        deleteFeaturedCourse,
        resetFeaturedCoursesToDefault,
        clubsList,
        clubs: clubsList,
        updateClub,
        addClub,
        deleteClub,
        resetClubsToDefault,
        houseStandings,
        updateHouseStanding,
        addHouseStanding,
        deleteHouseStanding,
        resetHouseStandingsToDefault,
        busRoutes,
        updateBusRoute,
        addBusRoute,
        deleteBusRoute,
        resetBusRoutesToDefault,
        mealMenu,
        updateMealMenuItem,
        resetMealMenuToDefault,
        calendarEvents,
        updateCalendarEvent,
        addCalendarEvent,
        deleteCalendarEvent,
        resetCalendarEventsToDefault,
        testimonials,
        testimonialsHeader,
        updateTestimonial,
        addTestimonial,
        deleteTestimonial,
        updateTestimonialsHeader,
        resetTestimonialsToDefault,
        // 17. FAQ Section
        faqItems,
        faqHeader,
        faqContent: faqHeader,
        updateFaqItem,
        addFaqItem,
        deleteFaqItem,
        updateFaqHeader,
        updateFaqContent: updateFaqHeader,
        resetFaqToDefault,
        resetFaqsToDefault: resetFaqToDefault,
        // 18. Database Snapshot Resilience
        exportDatabaseSnapshot,
        importDatabaseSnapshot,
        syncEntireDatabaseToSupabase,
        // 19. Attendance & Term Resumption
        attendanceRecords,
        termResumptionConfig,
        setTermStartDate,
        setTermResumptionDate,
        resetDailyAttendanceCounter,
        startNewTerm,
        submitDailyAttendance,
        getClassAttendanceSummary,
        getStudentAttendanceSummary,
        // 20. CBT Practice & Examination Engine
        cbtExams,
        cbtAttempts,
        addCbtExam,
        deleteCbtExam,
        recordCbtAttempt,
        // 21. Weekly Timetable & Bell Schedule
        timetables,
        updateClassTimetable,
        // 22. Medical & Clinic Sick-Bay
        sickBayLogs,
        addSickBayLog,
        updateSickBayLog,
        deleteSickBayLog,
        // 23. Parent Portal & Family Linkage
        parents,
        activeParentId,
        isParentAuthenticated,
        addParent,
        updateParent,
        deleteParent,
        loginParent,
        logoutParent,
        consultationRequests,
        submitConsultationRequest,
        updateConsultationStatus,
        feePayments,
        recordFeePayment,
        verifyFeePayment,
        rejectFeePayment,
        // 24. Digital Library & E-Textbooks
        libraryBooks,
        addLibraryBook,
        deleteLibraryBook,
        incrementBookDownload,
        // 25. Calvin AI Tokens & Access
        calvinTokens,
        createCalvinTokens,
        redeemCalvinToken,
        revokeCalvinToken,
        grantDirectCalvinAccess,
        recordCalvinQuestionAsked,
        sendTokenActivationPrompt,
        dismissTokenPrompt,
        acceptTokenPromptAndActivate,
        // 26. Staff Photo, Signature & Principal Appointments
        appointPrincipal,
        updateTutorPhotoAndSignature,
        // 27. Subject Schemes of Work & AI Curriculum Grounding
        schemesOfWork,
        addSchemeOfWork,
        updateSchemeOfWork,
        deleteSchemeOfWork,
        resetSchemesToDefault,
        getSchemeForSubjectAndClass,
        // 28. School Community Chat System (Students, Parents, Tutors & Admin)
        chatChannels,
        chatMessages,
        addChatChannel,
        updateChatChannel,
        deleteChatChannel,
        sendChatMessage,
        deleteChatMessage,
        flagChatMessage,
        resetChatToDefault,
        toggleChatReaction,
        togglePinChatMessage,
        markChannelAsRead,
        getChannelUnreadCount,
        getTotalUnreadCount,
        isFloatingChatOpen,
        setIsFloatingChatOpen,
        activeFloatingChatChannelId,
        setActiveFloatingChatChannelId,
        // 29. Campus Gallery Photos (Facilities & Events)
        galleryPhotos,
        addGalleryPhoto,
        updateGalleryPhoto,
        deleteGalleryPhoto,
        resetGalleryPhotosToDefault,
        // 30. Prefects, Club Leaders & Ephemeral 16-Hour Statuses
        assignClassPrefects,
        assignClubLeaders,
        assignStudentPrefectBadge,
        updateStudentChatSettings,
        ephemeralStatuses,
        postEphemeralStatus,
        deleteEphemeralStatus,
        markEphemeralStatusViewed,
        // 31. School News & Blog System
        newsArticles,
        addNewsArticle,
        updateNewsArticle,
        deleteNewsArticle,
        likeNewsArticle,
        pressClubPresidentStudentId,
        pressClubEditorStudentIds,
        assignPressClubPresident,
        nominatePressClubEditor,
        removePressClubEditor,
        resetNewsArticlesToDefault,
        studentSubmissions,
        submitArticleForReview,
        reviewStudentSubmission,
        // 32. School Representative & Landing Page Visitor Inquiries
        schoolRepConfig,
        updateSchoolRepConfig,
        toggleRepAvailability,
        visitorConversations,
        sendVisitorMessage,
        replyAsRepresentative,
        requestCalvinAiInstantReply,
        getVisitorConversation,
        markVisitorConversationRead,
        markConversationSeenByAdmin,
        markConversationSeenByVisitor,
        setChatTyping,
        typingMap,
        bookChatAppointment,
        transferConversationDepartment,
        updateVisitorNotificationOptIn,
        // Headmistress, Moderator & RBAC Privileges System
        headmistressProfile,
        updateHeadmistressProfile,
        moderators,
        addModerator,
        updateModerator,
        deleteModerator,
        activeModeratorId,
        setActiveModeratorId,
        rolePrivileges,
        updateRolePrivilege,
        resetRolePrivileges,
        hasPrivilege
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
