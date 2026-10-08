import { 
  AppImages, 
  Notice, 
  AdmissionApplication, 
  Homework, 
  GradeRecord, 
  StudentProfile, 
  TutorProfile, 
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
  HistoricalSessionRecord,
  CbtExam,
  CbtAttempt,
  ClassWeeklyTimetable,
  SickBayVisitLog,
  ParentProfile,
  ParentConsultationRequest,
  FeePaymentRecord,
  LibraryBookItem,
  ChatChannel,
  SchoolChatMessage,
  SchoolRepConfig,
  VisitorConversation
} from '../types';

export const DEFAULT_IMAGES: AppImages = {
  crest: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&auto=format&fit=crop&q=80',
  hero: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
  founders: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  earlyYears: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
  artClass: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
  faculty: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
  soccer: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80',
  cultural: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80'
};

export const SCHOOL_INFO: SchoolInfo = {
  name: 'Stanbax Schools',
  motto: 'Excellence, Character & Global Leadership',
  address: 'Plot 12, Stanbax Boulevard, Ring Road',
  city: 'Ibadan',
  state: 'Oyo State',
  country: 'Nigeria',
  phone: '+234 803 123 4567',
  email: 'info@stanbaxschools.edu.ng',
  whatsapp: '+2348031234567',
  activeSession: '2026/2027 Academic Session',
  activeTerm: '1st Term (Michaelmas Term)',
  resumptionDate: '2026-09-15',
  vacationDate: '2026-12-18',
  stats: [
    { label: 'Academic Rating', value: '100% WASSCE' },
    { label: 'Scholars Enrolled', value: '850+' },
    { label: 'Dedicated Faculty', value: '65+' },
    { label: 'Years of Heritage', value: '18+' }
  ]
};

export const DEFAULT_SCHOOL_STATS = SCHOOL_INFO.stats || [];

export const DEFAULT_CLASSES: SchoolClass[] = [
  { id: 'cls-1', name: 'Creche & Playgroup', category: 'Early Years', tuitionPerTerm: 120000, description: 'Nurturing toddler development ages 3 months - 2 years', isActive: true },
  { id: 'cls-2', name: 'Nursery 1', category: 'Early Years', tuitionPerTerm: 135000, description: 'Foundational literacy and sensory play', isActive: true },
  { id: 'cls-3', name: 'Nursery 2', category: 'Early Years', tuitionPerTerm: 140000, description: 'Phonics, early numeracy, and social development', isActive: true },
  { id: 'cls-4', name: 'Primary 1', category: 'Primary', tuitionPerTerm: 155000, description: 'Lower primary core curriculum', isActive: true },
  { id: 'cls-5', name: 'Primary 2', category: 'Primary', tuitionPerTerm: 160000, description: 'Lower primary STEM and language arts', isActive: true },
  { id: 'cls-6', name: 'Primary 3', category: 'Primary', tuitionPerTerm: 165000, description: 'Consolidation of reading and computation', isActive: true },
  { id: 'cls-7', name: 'Primary 4', category: 'Primary', tuitionPerTerm: 170000, description: 'Middle primary logic and discovery science', isActive: true },
  { id: 'cls-8', name: 'Primary 5', category: 'Primary', tuitionPerTerm: 180000, description: 'Pre-exam preparation and advanced inquiry', isActive: true },
  { id: 'cls-9', name: 'Primary 6', category: 'Primary', tuitionPerTerm: 190000, description: 'Common entrance coaching and leadership', isActive: true },
  { id: 'cls-10', name: 'JSS 1', category: 'Junior Secondary', tuitionPerTerm: 210000, description: 'Transition to secondary education and sciences', isActive: true, classTeacherId: 'tut-2' },
  { id: 'cls-11', name: 'JSS 2', category: 'Junior Secondary', tuitionPerTerm: 220000, description: 'Junior secondary consolidation', isActive: true },
  { id: 'cls-12', name: 'JSS 3', category: 'Junior Secondary', tuitionPerTerm: 235000, description: 'BECE / Junior WAEC examination class', isActive: true },
  { id: 'cls-13', name: 'SSS 1 Science', category: 'Senior Secondary', tuitionPerTerm: 250000, description: 'Pure sciences & robotics track', isActive: true },
  { id: 'cls-14', name: 'SSS 2 Science', category: 'Senior Secondary', tuitionPerTerm: 265000, description: 'Advanced physics, chemistry, and calculus', isActive: true, classTeacherId: 'tut-1', prefectStudentId: 'stu-1', assistantPrefectStudentId: 'stu-2' },
  { id: 'cls-15', name: 'SSS 3 Science', category: 'Senior Secondary', tuitionPerTerm: 280000, description: 'WASSCE, NECO & UTME preparation', isActive: true },
  { id: 'cls-16', name: 'SSS 2 Arts & Commercial', category: 'Senior Secondary', tuitionPerTerm: 265000, description: 'Economics, literature, government and commerce', isActive: true, classTeacherId: 'tut-3' }
];

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Mathematics', code: 'MTH', applicableCategories: ['Early Years', 'Primary', 'Junior Secondary', 'Senior Secondary'], applicableLevels: ['Early Years', 'Primary', 'Junior Secondary', 'Senior Secondary'], description: 'Pure and applied mathematics' },
  { id: 'sub-2', name: 'English Language', code: 'ENG', applicableCategories: ['Early Years', 'Primary', 'Junior Secondary', 'Senior Secondary'], applicableLevels: ['Early Years', 'Primary', 'Junior Secondary', 'Senior Secondary'], description: 'Grammar, composition, comprehension, and oral English' },
  { id: 'sub-3', name: 'Physics', code: 'PHY', applicableCategories: ['Senior Secondary'], applicableLevels: ['Senior Secondary'], description: 'Mechanics, electricity, optics, and modern physics' },
  { id: 'sub-4', name: 'Chemistry', code: 'CHM', applicableCategories: ['Senior Secondary'], applicableLevels: ['Senior Secondary'], description: 'Physical, inorganic, and organic chemistry' },
  { id: 'sub-5', name: 'Biology', code: 'BIO', applicableCategories: ['Senior Secondary'], applicableLevels: ['Senior Secondary'], description: 'Cell biology, physiology, ecology, and genetics' },
  { id: 'sub-6', name: 'Basic Science', code: 'BSC', applicableCategories: ['Junior Secondary'], applicableLevels: ['Junior Secondary'], description: 'Foundations of integrated science' },
  { id: 'sub-7', name: 'Civic Education', code: 'CIV', applicableCategories: ['Primary', 'Junior Secondary', 'Senior Secondary'], applicableLevels: ['Primary', 'Junior Secondary', 'Senior Secondary'], description: 'Citizenship, ethics, and democratic principles' },
  { id: 'sub-8', name: 'Computer Studies / Coding', code: 'ICT', applicableCategories: ['Primary', 'Junior Secondary', 'Senior Secondary'], applicableLevels: ['Primary', 'Junior Secondary', 'Senior Secondary'], description: 'Information technology, coding, and digital literacy' },
  { id: 'sub-9', name: 'Economics', code: 'ECO', applicableCategories: ['Senior Secondary'], applicableLevels: ['Senior Secondary'], description: 'Macro and micro-economics' },
  { id: 'sub-10', name: 'Literature in English', code: 'LIT', applicableCategories: ['Senior Secondary'], applicableLevels: ['Senior Secondary'], description: 'Prose, poetry, drama, and African literature' },
  { id: 'sub-11', name: 'Agricultural Science', code: 'AGR', applicableCategories: ['Junior Secondary', 'Senior Secondary'], applicableLevels: ['Junior Secondary', 'Senior Secondary'], description: 'Crop science, animal husbandry, and agricultural economics' },
  { id: 'sub-12', name: 'Further Mathematics', code: 'FMT', applicableCategories: ['Senior Secondary'], applicableLevels: ['Senior Secondary'], description: 'Advanced calculus, matrices, and applied reasoning' },
  { id: 'sub-13', name: 'French Language', code: 'FRN', applicableCategories: ['Primary', 'Junior Secondary', 'Senior Secondary'], applicableLevels: ['Primary', 'Junior Secondary', 'Senior Secondary'], description: 'French vocabulary, grammar, and conversational drills' },
  { id: 'sub-14', name: 'Data Processing', code: 'DPR', applicableCategories: ['Senior Secondary'], applicableLevels: ['Senior Secondary'], description: 'Data management, spreadsheets, and information processing' }
];

export const DEFAULT_GRADING_SYSTEM: GradeRule[] = [
  { id: 'gr-1', grade: 'A1', minScore: 75, maxScore: 100, remark: 'Excellent Distinction', color: '#16a34a' },
  { id: 'gr-2', grade: 'B2', minScore: 70, maxScore: 74, remark: 'Very Good', color: '#2563eb' },
  { id: 'gr-3', grade: 'B3', minScore: 65, maxScore: 69, remark: 'Good', color: '#3b82f6' },
  { id: 'gr-4', grade: 'C4', minScore: 60, maxScore: 64, remark: 'Credit (Upper)', color: '#d97706' },
  { id: 'gr-5', grade: 'C5', minScore: 55, maxScore: 59, remark: 'Credit', color: '#f59e0b' },
  { id: 'gr-6', grade: 'C6', minScore: 50, maxScore: 54, remark: 'Credit (Lower)', color: '#eab308' },
  { id: 'gr-7', grade: 'D7', minScore: 45, maxScore: 49, remark: 'Pass', color: '#ea580c' },
  { id: 'gr-8', grade: 'E8', minScore: 40, maxScore: 44, remark: 'Weak Pass', color: '#f97316' },
  { id: 'gr-9', grade: 'F9', minScore: 0, maxScore: 39, remark: 'Fail', color: '#dc2626' }
];

export const DEFAULT_ASSESSMENT_CONFIG: AssessmentControlConfig = {
  activeSession: '2026/2027 Academic Session',
  activeTerm: '1st Term',
  activePhase: 'mid_term_ca',
  midTermResultsPublished: false,
  endTermResultsPublished: false,
  ca1Max: 10,
  ca2Max: 10,
  ca3Max: 10,
  examMax: 70,
  promotionPassMarkPercent: 50,
  autoRankingEnabled: true,
  lastPromotionDate: 'Jul 24, 2025',
  promotionHistory: []
};

export const DEMO_TUTOR: TutorProfile = {
  id: 'tut-1',
  staffId: 'STX/FAC/001',
  name: 'Mr. Olumide Ogunleye',
  email: 'olumide.ogunleye@stanbaxschools.edu.ng',
  password: 'stanbax2025',
  role: 'Senior Science Master & Class Teacher',
  department: 'Sciences & STEM',
  qualification: 'B.Sc. (Ed) Physics, M.Ed Educational Measurement (University of Ibadan)',
  phone: '+234 805 554 4321',
  bio: 'Passionate STEM educator with over 14 years preparing students for national and international science olympiads.',
  assignedClasses: ['SSS 2 Science', 'SSS 1 Science'],
  assignedSubjects: ['Physics', 'Mathematics', 'Computer Studies / Coding']
};

export const DEMO_TUTORS: TutorProfile[] = [
  DEMO_TUTOR,
  {
    id: 'tut-2',
    staffId: 'STX/FAC/002',
    name: 'Mrs. Folake Adeyemi',
    email: 'folake.adeyemi@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    role: 'Head of Languages & JSS 1 Class Teacher',
    department: 'Languages & Humanities',
    qualification: 'B.A. English (Obafemi Awolowo University)',
    phone: '+234 802 331 9876',
    bio: 'Dedicated linguist focused on diction, creative writing, and public speaking excellence.',
    assignedClasses: ['JSS 1', 'JSS 2', 'JSS 3'],
    assignedSubjects: ['English Language', 'Literature in English']
  },
  {
    id: 'tut-3',
    staffId: 'STX/FAC/003',
    name: 'Dr. Chukwuemeka Obi',
    email: 'chukwuemeka.obi@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    role: 'Senior Commercial Tutor & Class Teacher',
    department: 'Commercial Studies',
    qualification: 'Ph.D. Economics (University of Nigeria, Nsukka)',
    phone: '+234 807 665 1122',
    bio: 'Experienced economist introducing young scholars to market dynamics and entrepreneurship.',
    assignedClasses: ['SSS 2 Arts & Commercial', 'SSS 3 Science'],
    assignedSubjects: ['Economics', 'Civic Education']
  },
  {
    id: 'tut-4',
    staffId: 'STX/FAC/004',
    name: 'Dr. Chidi Okafor',
    email: 'chidi.okafor@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    role: 'Chemistry Tutor',
    department: 'Sciences & STEM',
    qualification: 'Ph.D. Chemistry (University of Lagos)',
    phone: '+234 806 221 3344',
    bio: 'Analytical chemist and practical-laboratory specialist.',
    assignedClasses: ['SSS 2 Science'],
    assignedSubjects: ['Chemistry']
  },
  {
    id: 'tut-5',
    staffId: 'STX/FAC/005',
    name: 'Dr. (Mrs) Nkechi Nwosu',
    email: 'nkechi.nwosu@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    role: 'Biology Tutor',
    department: 'Sciences & STEM',
    qualification: 'Ph.D. Microbiology (University of Ibadan)',
    phone: '+234 803 990 1221',
    bio: 'Life-sciences educator leading the school’s biology practicals programme.',
    assignedClasses: ['SSS 2 Science'],
    assignedSubjects: ['Biology']
  },
  {
    id: 'tut-6',
    staffId: 'STX/FAC/006',
    name: 'Mr. Emmanuel Danjuma',
    email: 'emmanuel.danjuma@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    role: 'Agricultural Science Tutor',
    department: 'Sciences & STEM',
    qualification: 'B.Agric. (Ahmadu Bello University)',
    phone: '+234 805 112 7788',
    bio: 'Runs the demonstration farm and school garden enterprise project.',
    assignedClasses: ['SSS 2 Science', 'JSS 1'],
    assignedSubjects: ['Agricultural Science']
  },
  {
    id: 'tut-7',
    staffId: 'STX/FAC/007',
    name: 'Madame DuPont',
    email: 'dupont@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    role: 'French Language Tutor',
    department: 'Languages & Humanities',
    qualification: 'DELF/DALF Certified, Université de Lomé',
    phone: '+234 810 445 9023',
    bio: 'Native French instructor preparing scholars for international language benchmarks.',
    assignedClasses: ['SSS 2 Science', 'JSS 1'],
    assignedSubjects: ['French & Foreign Language']
  }
];

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Mrs. Adebisi Folashade Bello',
    role: 'Proprietress & Chief Executive',
    qualification: 'B.Sc., M.Sc. Educational Management (UI)',
    department: 'Executive Council',
    bio: 'Visionary educational administrator committed to character development and global benchmarks.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    displayOrder: 1
  },
  {
    id: 'fac-2',
    name: 'Mr. Olumide Ogunleye',
    role: 'Senior Science Master',
    qualification: 'B.Sc. (Ed) Physics, M.Ed (UI)',
    department: 'Sciences & STEM',
    bio: 'Expert physics instructor and lead robotics mentor.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    displayOrder: 2
  },
  {
    id: 'fac-3',
    name: 'Mrs. Folake Adeyemi',
    role: 'Head of Languages',
    qualification: 'B.A. English (OAU)',
    department: 'Languages',
    bio: 'Leading our speech and language development laboratory.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    displayOrder: 3
  },
  {
    id: 'fac-4',
    name: 'Dr. Chukwuemeka Obi',
    role: 'Head of Social Sciences',
    qualification: 'Ph.D. Economics (UNN)',
    department: 'Commercial & Humanities',
    bio: 'Fostering financial literacy and ethical commerce.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    displayOrder: 4
  }
];

export const DEMO_GRADES: GradeRecord[] = [
  { id: 'grd-1', subject: 'Mathematics', ca1: 9, ca2: 8, ca3: 9, exam: 62, total: 88, grade: 'A1', remark: 'Excellent Distinction', color: '#16a34a' },
  { id: 'grd-2', subject: 'English Language', ca1: 8, ca2: 9, ca3: 8, exam: 58, total: 83, grade: 'A1', remark: 'Excellent Distinction', color: '#16a34a' },
  { id: 'grd-3', subject: 'Physics', ca1: 9, ca2: 9, ca3: 9, exam: 64, total: 91, grade: 'A1', remark: 'Outstanding Mastery', color: '#16a34a' },
  { id: 'grd-4', subject: 'Chemistry', ca1: 8, ca2: 8, ca3: 8, exam: 56, total: 80, grade: 'A1', remark: 'Excellent Distinction', color: '#16a34a' },
  { id: 'grd-5', subject: 'Biology', ca1: 9, ca2: 8, ca3: 7, exam: 55, total: 79, grade: 'A1', remark: 'Commendable Performance', color: '#16a34a' },
  { id: 'grd-6', subject: 'Civic Education', ca1: 8, ca2: 9, ca3: 9, exam: 60, total: 86, grade: 'A1', remark: 'Exemplary Civic Awareness', color: '#16a34a' },
  { id: 'grd-7', subject: 'Computer Studies / Coding', ca1: 10, ca2: 10, ca3: 9, exam: 65, total: 94, grade: 'A1', remark: 'Exceptional Coding Aptitude', color: '#16a34a' }
];

const gradeBand = (total: number): Pick<GradeRecord, 'grade' | 'remark' | 'color'> => {
  const rule = DEFAULT_GRADING_SYSTEM.find(r => total >= r.minScore && total <= r.maxScore);
  return rule ? { grade: rule.grade, remark: rule.remark, color: rule.color } : { grade: 'F9', remark: 'Fail', color: '#dc2626' };
};

// Deterministic per-scholar gradebook: shifts DEMO_GRADES exam scores so the
// scholar's gradebook roughly tracks their seeded term average.
const buildSeededGrades = (studentId: string, targetAverage: number, base: GradeRecord[] = DEMO_GRADES): GradeRecord[] => {
  const baseAvg = base.reduce((sum, g) => sum + g.total, 0) / base.length;
  const shift = Math.round(targetAverage - baseAvg);
  return base.map((g, i) => {
    const exam = Math.min(70, Math.max(0, g.exam + shift));
    const total = g.ca1 + g.ca2 + (g.ca3 ?? 0) + exam;
    return { ...g, id: `grd-${studentId}-${i + 1}`, exam, total, ...gradeBand(total) };
  });
};

export const JSS_DEMO_GRADES: GradeRecord[] = [
  { id: 'jgrd-1', subject: 'Mathematics', ca1: 9, ca2: 9, ca3: 8, exam: 60, total: 86, grade: 'A1', remark: 'Excellent Distinction', color: '#16a34a' },
  { id: 'jgrd-2', subject: 'English Language', ca1: 8, ca2: 8, ca3: 9, exam: 57, total: 82, grade: 'A1', remark: 'Excellent Distinction', color: '#16a34a' },
  { id: 'jgrd-3', subject: 'Basic Science', ca1: 9, ca2: 8, ca3: 9, exam: 61, total: 87, grade: 'A1', remark: 'Excellent Distinction', color: '#16a34a' },
  { id: 'jgrd-4', subject: 'Civic Education', ca1: 8, ca2: 9, ca3: 8, exam: 58, total: 83, grade: 'A1', remark: 'Excellent Distinction', color: '#16a34a' },
  { id: 'jgrd-5', subject: 'Computer Studies / Coding', ca1: 10, ca2: 9, ca3: 9, exam: 62, total: 90, grade: 'A1', remark: 'Excellent Distinction', color: '#16a34a' }
];

// Derives the class a scholar was promoted FROM given their current grade.
export const getPreviousClassName = (grade: string): string | null => {
  const progression = DEFAULT_CLASSES.map(c => c.name);
  const m = grade.match(/^(.*?)(\d+)(.*)$/);
  if (m) {
    const n = Number(m[2]);
    // Within a track, previous class is the same label one year down
    // (e.g. "SSS 2 Science" -> "SSS 1 Science", "SSS 2 Arts & Commercial"
    // -> "SSS 1 Arts & Commercial" even though that class isn't catalogued).
    if (n > 1) return `${m[1]}${n - 1}${m[3]}`.trim();
    // First year of a track -> previous class is the last year of the
    // preceding track in the class catalogue (e.g. "JSS 1" -> "Primary 6").
    const idx = progression.indexOf(grade);
    if (idx > 0) return progression[idx - 1];
    return null;
  }
  const idx = progression.indexOf(grade);
  if (idx > 0) return progression[idx - 1];
  return null;
};

export const generateStudentHistoricalRecords = (s: StudentProfile): HistoricalSessionRecord[] => {
  const previousClass = getPreviousClassName(s.grade);
  if (!previousClass) return [];
  const sessionMatch = SCHOOL_INFO.activeSession.match(/(\d{4})\/(\d{4})/);
  const sessionName = sessionMatch
    ? `${Number(sessionMatch[1]) - 1}/${Number(sessionMatch[2]) - 1} Academic Session`
    : '2025/2026 Academic Session';
  const base = s.termAverage;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return [
    {
      id: `hist-${s.id}-${sessionName.replace(/\D/g, '')}`,
      sessionName,
      classEnrolled: previousClass,
      annualAverage: r1(base - 1.0),
      promotionStatus: 'Promoted',
      promotedToGrade: s.grade,
      terms: {
        '1st Term': {
          term: '1st Term',
          termFullName: '1st Term (Michaelmas Term)',
          termAverage: r1(base - 2.3),
          attendanceDays: 58,
          totalSchoolDays: 60,
          classEnrolled: previousClass,
          teacherRemark: 'Commendable attendance and active participation.',
          principalRemark: 'A very promising scholar with strong academic inclination.',
          grades: buildSeededGrades(`${s.id}-h1`, r1(base - 2.3))
        },
        '2nd Term': {
          term: '2nd Term',
          termFullName: '2nd Term (Lent Term)',
          termAverage: r1(base - 1.1),
          attendanceDays: 59,
          totalSchoolDays: 60,
          classEnrolled: previousClass,
          teacherRemark: 'Consistent high marks in class exercises.',
          principalRemark: 'Excellent progress maintained across all subject areas.',
          grades: buildSeededGrades(`${s.id}-h2`, r1(base - 1.1))
        },
        '3rd Term': {
          term: '3rd Term',
          termFullName: '3rd Term (Trinity Term)',
          termAverage: r1(base - 0.4),
          attendanceDays: 58,
          totalSchoolDays: 59,
          classEnrolled: previousClass,
          teacherRemark: 'Outstanding terminal performance and moral leadership.',
          principalRemark: `Promoted to ${s.grade} with flying colours.`,
          grades: buildSeededGrades(`${s.id}-h3`, r1(base - 0.4))
        }
      }
    }
  ];
};

export const DEMO_STUDENT: StudentProfile = {
  id: 'stu-1',
  regNumber: 'STX/2023/042',
  name: 'Tiwa Adeleke',
  grade: 'SSS 2 Science',
  classId: 'cls-14',
  gender: 'Female',
  dateOfBirth: '2009-04-14',
  parentName: 'Chief & Mrs. Adebayo Adeleke',
  parentPhone: '+234 803 445 6789',
  parentEmail: 'adeleke.family@gmail.com',
  email: 'stx2023042@stanbaxschools.edu.ng',
  password: 'stanbax2025',
  securityQuestion: 'What is your favourite subject?',
  securityAnswer: 'Physics',
  house: 'Sapphire (Blue House)',
  clubs: ['Literary & Debating Society', 'JETS Science & Robotics Club'],
  attendancePercent: 98,
  attendanceDays: 59,
  totalSchoolDays: 60,
  termAverage: 85.6,
  term1Average: 85.6,
  cumulativeAnnualAverage: 85.6,
  promotionStatus: 'Promoted',
  promotedToGrade: 'SSS 2 Science',
  grades: DEMO_GRADES,
  feeTotal: 265000,
  feePaid: 185000,
  feeBalance: 80000,
  feeStatus: 'Partially Paid',
  chatSettings: {
    showOnlineStatus: true,
    allowDirectMessages: true,
    dmPermission: 'anyone'
  }
};

export const DEMO_STUDENTS: StudentProfile[] = [
  DEMO_STUDENT,
  {
    id: 'stu-2',
    regNumber: 'STX/2023/043',
    name: 'Babatunde Akindele',
    grade: 'SSS 2 Science',
    classId: 'cls-14',
    gender: 'Male',
    dateOfBirth: '2008-11-20',
    parentName: 'Engr. & Dr. Akindele',
    parentPhone: '+234 802 887 6543',
    parentEmail: 'akindele.eng@yahoo.com',
    email: 'stx2023043@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    house: 'Ruby (Red House)',
    clubs: ['JETS Science & Robotics Club'],
    attendancePercent: 95,
    attendanceDays: 57,
    totalSchoolDays: 60,
    termAverage: 81.4,
    term1Average: 81.4,
    cumulativeAnnualAverage: 81.4,
    promotionStatus: 'Promoted',
    promotedToGrade: 'SSS 2 Science',
    grades: buildSeededGrades('stu-2', 81.4),
    feeTotal: 265000,
    feePaid: 185000,
    feeBalance: 80000,
    feeStatus: 'Partially Paid'
  },
  {
    id: 'stu-3',
    regNumber: 'STX/2023/044',
    name: 'Chidera Okafor',
    grade: 'SSS 2 Science',
    classId: 'cls-14',
    gender: 'Female',
    dateOfBirth: '2009-01-15',
    parentName: 'Mr. & Mrs. Obinna Okafor',
    parentPhone: '+234 809 112 3456',
    parentEmail: 'okafor.family@gmail.com',
    email: 'stx2023044@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    house: 'Emerald (Green House)',
    clubs: ['Literary & Debating Society', 'Music & Brass Band'],
    attendancePercent: 97,
    attendanceDays: 58,
    totalSchoolDays: 60,
    termAverage: 88.2,
    term1Average: 88.2,
    cumulativeAnnualAverage: 88.2,
    promotionStatus: 'Promoted',
    promotedToGrade: 'SSS 2 Science',
    grades: buildSeededGrades('stu-3', 88.2),
    feeTotal: 265000,
    feePaid: 0,
    feeBalance: 265000,
    feeStatus: 'Outstanding'
  },
  {
    id: 'stu-4',
    regNumber: 'STX/2023/045',
    name: 'Damilola Fashola',
    grade: 'SSS 2 Science',
    classId: 'cls-14',
    gender: 'Male',
    dateOfBirth: '2008-09-08',
    parentName: 'Barrister Fashola',
    parentPhone: '+234 805 776 5432',
    parentEmail: 'fashola.law@gmail.com',
    email: 'stx2023045@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    house: 'Topaz (Yellow House)',
    clubs: ['Press & Media Club'],
    attendancePercent: 92,
    attendanceDays: 55,
    totalSchoolDays: 60,
    termAverage: 76.5,
    term1Average: 76.5,
    cumulativeAnnualAverage: 76.5,
    promotionStatus: 'Promoted',
    promotedToGrade: 'SSS 2 Science',
    grades: buildSeededGrades('stu-4', 76.5),
    feeTotal: 265000,
    feePaid: 0,
    feeBalance: 265000,
    feeStatus: 'Outstanding'
  },
  {
    id: 'stu-5',
    regNumber: 'STX/2023/046',
    name: 'Efe Oghomwen',
    grade: 'SSS 2 Science',
    classId: 'cls-14',
    gender: 'Female',
    dateOfBirth: '2009-06-30',
    parentName: 'Dr. Osas Oghomwen',
    parentPhone: '+234 803 998 7766',
    parentEmail: 'oghomwen.clinic@gmail.com',
    email: 'stx2023046@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    house: 'Sapphire (Blue House)',
    clubs: ['JETS Science & Robotics Club'],
    attendancePercent: 96,
    attendanceDays: 58,
    totalSchoolDays: 60,
    termAverage: 83.9,
    term1Average: 83.9,
    cumulativeAnnualAverage: 83.9,
    promotionStatus: 'Promoted',
    promotedToGrade: 'SSS 2 Science',
    grades: buildSeededGrades('stu-5', 83.9),
    feeTotal: 265000,
    feePaid: 0,
    feeBalance: 265000,
    feeStatus: 'Outstanding'
  },
  {
    id: 'stu-6',
    regNumber: 'STX/2023/047',
    name: 'Farouk Danjuma',
    grade: 'SSS 2 Science',
    classId: 'cls-14',
    gender: 'Male',
    dateOfBirth: '2008-12-12',
    parentName: 'Alhaji & Hajia Danjuma',
    parentPhone: '+234 807 443 2211',
    parentEmail: 'danjuma.holdings@gmail.com',
    email: 'stx2023047@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    house: 'Ruby (Red House)',
    clubs: ['Music & Brass Band'],
    attendancePercent: 88,
    attendanceDays: 53,
    totalSchoolDays: 60,
    termAverage: 72.8,
    term1Average: 72.8,
    cumulativeAnnualAverage: 72.8,
    promotionStatus: 'Promoted',
    promotedToGrade: 'SSS 2 Science',
    grades: buildSeededGrades('stu-6', 72.8),
    feeTotal: 265000,
    feePaid: 0,
    feeBalance: 265000,
    feeStatus: 'Outstanding'
  },
  // Junior secondary scholars
  {
    id: 'stu-7',
    regNumber: 'STX/2024/101',
    name: 'Amina Bello',
    grade: 'JSS 1',
    classId: 'cls-10',
    gender: 'Female',
    dateOfBirth: '2012-05-18',
    parentName: 'Mr. & Mrs. Bello',
    parentPhone: '+234 802 334 5566',
    email: 'stx2024101@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    parentEmail: 'bello.family@gmail.com',
    house: 'Emerald (Green House)',
    clubs: ['Literary & Debating Society'],
    attendancePercent: 100,
    attendanceDays: 60,
    totalSchoolDays: 60,
    termAverage: 89.4,
    term1Average: 89.4,
    cumulativeAnnualAverage: 89.4,
    promotionStatus: 'Promoted',
    promotedToGrade: 'JSS 1',
    grades: buildSeededGrades('stu-7', 89.4, JSS_DEMO_GRADES),
    feeTotal: 210000,
    feePaid: 0,
    feeBalance: 210000,
    feeStatus: 'Outstanding'
  },
  {
    id: 'stu-8',
    regNumber: 'STX/2024/102',
    name: 'Kenechukwu Nnamdi',
    grade: 'JSS 1',
    classId: 'cls-10',
    gender: 'Male',
    dateOfBirth: '2012-08-22',
    parentName: 'Chief Nnamdi',
    parentPhone: '+234 805 667 8899',
    email: 'stx2024102@stanbaxschools.edu.ng',
    password: 'stanbax2025',
    parentEmail: 'nnamdi.family@gmail.com',
    house: 'Topaz (Yellow House)',
    clubs: ['Press & Media Club'],
    attendancePercent: 94,
    attendanceDays: 56,
    totalSchoolDays: 60,
    termAverage: 78.2,
    term1Average: 78.2,
    cumulativeAnnualAverage: 78.2,
    promotionStatus: 'Promoted',
    promotedToGrade: 'JSS 1',
    grades: buildSeededGrades('stu-8', 78.2, JSS_DEMO_GRADES),
    feeTotal: 210000,
    feePaid: 0,
    feeBalance: 210000,
    feeStatus: 'Outstanding'
  }
];

export const DEMO_HOMEWORKS: Homework[] = [
  {
    id: 'hw-1',
    title: 'Kinematics & Projectile Motion Problems (Ex 4.2)',
    subject: 'Physics',
    targetClass: 'SSS 2 Science',
    targetClassId: 'cls-14',
    dueDate: '2026-09-22',
    description: 'Solve questions 1 through 10 in Essential Physics Textbook Chapter 4. Clearly write out formulas, unit conversions, and diagrams.',
    status: 'Pending',
    assignedBy: 'Mr. Olumide Ogunleye'
  },
  {
    id: 'hw-2',
    title: 'Essay: The Impact of Artificial Intelligence on Nigerian Agriculture',
    subject: 'English Language',
    targetClass: 'SSS 2 Science',
    targetClassId: 'cls-14',
    dueDate: '2026-09-24',
    description: 'Write a persuasive essay of not less than 450 words discussing technological modernization in Nigerian farming.',
    status: 'Pending',
    submissions: { 'stu-1': 'Submitted' },
    assignedBy: 'Mrs. Folake Adeyemi'
  }
];

export const RECENT_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'New Term Resumption & Academic Orientation',
    date: '2026-09-15',
    category: 'Academic Calendar',
    content: 'All scholars and faculty members are warmly welcomed back to school. Morning assembly starts promptly at 7:45 AM. Full school uniform compliance is mandatory.',
    isImportant: true,
    audience: 'All'
  },
  {
    id: 'not-2',
    title: 'Inter-House Sports Gala Preparations',
    date: '2026-09-18',
    category: 'Extracurricular',
    content: 'House meetings will hold this Thursday after school hours for track & field trials across all four houses (Blue, Red, Yellow, and Green).',
    isImportant: false,
    audience: 'Scholars'
  },
  {
    id: 'not-3',
    title: 'Parent-Teacher Association (PTA) General Assembly',
    date: '2026-09-28',
    category: 'Administration',
    content: 'Notice is hereby given for our termly PTA general meeting at the School Multipurpose Auditorium. Virtual livestream will be provided for working parents.',
    isImportant: true,
    audience: 'Parents'
  }
];

export const INITIAL_APPLICATIONS: AdmissionApplication[] = [
  {
    id: 'app-1',
    refNumber: 'STX/ADM/2026/001',
    childName: 'Somtochukwu Eze',
    dateOfBirth: '2011-03-12',
    gender: 'Male',
    intendedClass: 'JSS 1',
    parentName: 'Engr. Kenneth Eze',
    parentPhone: '+234 803 776 5432',
    parentEmail: 'kenneth.eze@gmail.com',
    residentialAddress: '14 Alalubosa GRA, Ibadan',
    previousSchool: 'Crown Heights Primary School',
    dateSubmitted: '2026-08-10',
    status: 'Screening Scheduled',
    screeningDate: 'Sat, Sep 20, 2026',
    screeningTime: '09:00 AM',
    screeningVenue: 'Main School Hall, Stanbax Schools Ring Road'
  }
];

export const INITIAL_BROADCAST_LOGS: ParentBroadcastLog[] = [
  {
    id: 'blog-1',
    title: 'Welcome to the New Academic Term',
    channel: 'All',
    targetGroup: 'All Registered Parents',
    message: 'Dear Parents, we welcome our scholars back to school for the new term. Daily attendance marking has commenced. Please ensure prompt resumption.',
    dateSent: 'Sep 15, 2026, 07:30 AM',
    recipientCount: 420
  }
];

export const DEFAULT_PROPRIETRESS_PROFILE: ProprietressProfile = {
  name: 'Mrs. Adebisi Folashade Bello',
  title: 'Founder & Proprietress',
  quote: 'Every child entrusted to Stanbax Schools is nurtured to become a pillar of character, intellectual excellence, and visionary leadership.',
  welcomeMessage: 'Welcome to Stanbax Schools Ibadan, where academic discipline meets modern digital innovation in a caring and godly atmosphere.',
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  email: 'proprietress@stanbaxschools.edu.ng',
  phone: '+234 803 123 4567',
  officeHours: 'Monday – Thursday: 10:00 AM – 02:00 PM (By Appointment)'
};

export const DEFAULT_PROPRIETRESS_APPOINTMENTS: ProprietressAppointment[] = [];
export const DEFAULT_PROPRIETRESS_MESSAGES: ProprietressMessage[] = [];
export const DEFAULT_PROPRIETRESS_DIRECTIVES: ProprietressDirective[] = [
  {
    id: 'dir-1',
    title: 'Mandatory Class Attendance Register & Daily Submission',
    targetAudience: 'Faculty',
    date: '2026-09-15',
    priority: 'High',
    content: 'All class teachers must mark daily morning attendance for all enrolled scholars and submit before 09:00 AM. Total attendance counts must be synchronized for institutional records.',
    signedBy: 'Mrs. Adebisi Folashade Bello (Proprietress)'
  }
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'Premier Education in Ibadan',
    title: 'Nurturing Global Minds & Noble Character',
    subtitle: 'From Creche through Senior Secondary School, Stanbax Schools provides state-of-the-art facilities, British-Nigerian curriculum, and holistic moral development.',
    ctaText: 'Apply for Admission',
    ctaAction: 'open-admissions',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'slide-2',
    badge: 'Modern STEM & Robotics',
    title: 'Equipping Tomorrow’s Innovators Today',
    subtitle: 'Hands-on robotics arenas, high-speed coding laboratories, and enriched practical science spaces designed to ignite curious scientific minds.',
    ctaText: 'Explore Academic Programs',
    ctaAction: 'programs',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_HERO_HIGHLIGHTS: string[] = [
  '100% WASSCE & NECO Distinction Record',
  'State-of-the-Art Science & Computing Laboratories',
  'Enriched Hybrid British-Nigerian Curriculum',
  'Robotics, AI & Digital Literacy Labs'
];

export const DEFAULT_KEY_PILLARS: KeyPillarItem[] = [
  {
    id: 'pil-1',
    iconName: 'GraduationCap',
    title: 'Academic Distinction',
    description: 'Consistently ranked among the top schools in Oyo State with unmatched WASSCE, NECO, and Cambridge IGCSE performance.'
  },
  {
    id: 'pil-2',
    iconName: 'FlaskConical',
    title: 'Modern STEM Laboratories',
    description: 'Fully equipped physics, chemistry, biology, robotics, and coding facilities for experiential hands-on learning.'
  },
  {
    id: 'pil-3',
    iconName: 'ShieldCheck',
    title: 'Character & Moral Values',
    description: 'Rooted in integrity, discipline, empathy, and leadership ethics that prepare scholars for lifelong impact.'
  },
  {
    id: 'pil-4',
    iconName: 'Award',
    title: 'Dedicated Certified Faculty',
    description: 'Passionate educators with advanced degrees and ongoing TRCN pedagogical certifications.'
  }
];

export const DEFAULT_KEY_PILLARS_HEADER: KeyPillarsHeader = {
  badge: 'The Stanbax Distinction',
  title: 'Why Parents Choose Stanbax Schools Ibadan',
  subtitle: 'A tradition of academic excellence, technological fluency, and grounded moral values in the heart of Oyo State.'
};

export const DEFAULT_ABOUT_CONTENT: AboutSectionContent = {
  badge: 'About Our Institution',
  title: 'Building Legacies of Excellence in Ibadan Since 2007',
  description: 'Founded with a profound vision to raise confident, morally sound, and globally competitive scholars, Stanbax Schools has blossomed into an educational landmark in Ibadan.',
  founderName: 'Mrs. Adebisi Folashade Bello',
  founderRole: 'Founder & Proprietress',
  establishedYear: '2007',
  vision: 'To be Nigeria’s foremost institution where holistic education inspires future global leaders.',
  mission: 'To provide world-class, learner-centered education combining academic rigour, technological mastery, and solid moral foundations.'
};

export const DEFAULT_TESTIMONIALS_HEADER: TestimonialsSectionContent = {
  badge: 'Parent & Scholar Voices',
  title: 'Trusted by Over 800 Families in Ibadan',
  subtitle: 'Hear directly from parents and alumni about the transformative impact of the Stanbax education.'
};

export const DEFAULT_ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: 'prog-1',
    title: 'Early Years & Foundation Stage',
    ageRange: 'Ages 3 Months – 5 Years',
    gradeLevels: 'Creche, Playgroup, Nursery 1 & 2',
    description: 'Gentle, stimulating environments fostering early phonics, sensory exploration, numbers, and social confidence.',
    features: ['Montessori-inspired learning aids', 'Safe infant nap pods & play zones', 'Creative developmental play & sensory learning', 'Experienced toddler caregivers'],
    color: 'amber',
    iconName: 'School'
  },
  {
    id: 'prog-2',
    title: 'Primary School (Basic 1 – 6)',
    ageRange: 'Ages 5 – 11 Years',
    gradeLevels: 'Primary 1 to Primary 6',
    description: 'Solid grounding in literacy, mathematics, discovery science, French, cultural arts, and digital coding.',
    features: ['Accelerated reading & phonetics', 'Singapore mathematics methodology', 'Weekly coding & robotics labs', 'Inter-school debate & sports'],
    color: 'blue',
    iconName: 'BookOpen'
  },
  {
    id: 'prog-3',
    title: 'Junior Secondary School',
    ageRange: 'Ages 11 – 14 Years',
    gradeLevels: 'JSS 1 to JSS 3',
    description: 'Rigorous foundation in integrated sciences, pre-vocational studies, languages, and critical analytical thinking.',
    features: ['Comprehensive BECE preparation', 'Introductory lab sciences', 'Leadership and mentorship circles', 'Young Inventors & STEM club'],
    color: 'emerald',
    iconName: 'FlaskConical'
  },
  {
    id: 'prog-4',
    title: 'Senior Secondary School',
    ageRange: 'Ages 14 – 17 Years',
    gradeLevels: 'SSS 1 to SSS 3',
    description: 'Specialized tracks across Science, Arts & Humanities, and Commercial studies targeting university matriculation.',
    features: ['Intensive WASSCE / NECO drills', 'UTME computer-based mock testing', 'University guidance counselling', 'Olympiad competitions'],
    color: 'purple',
    iconName: 'GraduationCap'
  }
];

export const DEFAULT_FEATURED_COURSES: FeaturedCourse[] = [
  {
    id: 'fc-1',
    title: 'Robotics & Applied Artificial Intelligence',
    level: 'Upper Primary & Secondary',
    description: 'Hands-on micro-controller programming, sensor integration, and algorithm design.',
    highlights: ['Arduino & Micro:bit programming', 'Autonomous line-follower robotics', 'National STEM exhibition entry']
  },
  {
    id: 'fc-2',
    title: 'Speech Diction & Public Oratory',
    level: 'All Grades',
    description: 'Mastery of phonetics, elocution, debate, and persuasive presentation skills.',
    highlights: ['Queen’s English phonetic drill', 'Model United Nations participation', 'Termly public speaking contest']
  }
];

export const DEFAULT_CLUBS_LIST: Club[] = [
  { id: 'cl-1', name: 'JETS Science & Robotics Club', category: 'STEM', meetingDay: 'Wednesday (03:00 PM)', patron: 'Mr. Olumide Ogunleye', description: 'Hands-on scientific experiments, gadget prototyping, and national olympiad preparation.' },
  { id: 'cl-2', name: 'Literary & Debating Society', category: 'Humanities', meetingDay: 'Thursday (03:00 PM)', patron: 'Mrs. Folake Adeyemi', description: 'Sharpening public speaking, research, argument formulation, and mock parliament sessions.' },
  { id: 'cl-3', name: 'Music & Brass Band', category: 'Creative Arts', meetingDay: 'Friday (02:30 PM)', patron: 'Mr. David Adeleke', description: 'Orchestral instruments, piano, brass, traditional African drums, and vocal ensemble.' },
  { id: 'cl-4', name: 'Press & Media Club', category: 'Journalism', meetingDay: 'Tuesday (03:15 PM)', patron: 'Dr. Chukwuemeka Obi', description: 'Publishing the termly school newsletter, documentary photography, and broadcast journalism.' }
];

export const DEFAULT_HOUSE_STANDINGS: HouseStanding[] = [
  { name: 'Sapphire (Blue House)', color: '#2563eb', points: 1420, motto: 'Valour and Integrity', houseMaster: 'Mr. Olumide Ogunleye' },
  { name: 'Ruby (Red House)', color: '#dc2626', points: 1385, motto: 'Courage to Excel', houseMaster: 'Mrs. Folake Adeyemi' },
  { name: 'Emerald (Green House)', color: '#16a34a', points: 1350, motto: 'Growth and Fruitfulness', houseMaster: 'Dr. Chukwuemeka Obi' },
  { name: 'Topaz (Yellow House)', color: '#ca8a04', points: 1310, motto: 'Brilliance in Service', houseMaster: 'Mrs. Funke Balogun' }
];

export const DEFAULT_BUS_ROUTES: BusRoute[] = [
  { id: 'rt-1', routeName: 'Route A: Ring Road – Challenge – Molete', coverageAreas: ['Ring Road', 'Challenge', 'Molete', 'Iyana Adeoyo'], driverName: 'Mr. Baba Tunde', contactNumber: '+234 802 334 1122', morningDeparture: '06:45 AM', afternoonDeparture: '03:45 PM', busNumber: 'STX-BUS-01' },
  { id: 'rt-2', routeName: 'Route B: Bodija – Secretariat – Agodi GRA', coverageAreas: ['Old Bodija', 'New Bodija', 'Secretariat', 'Agodi GRA'], driverName: 'Mr. Rasheed Alao', contactNumber: '+234 803 778 9900', morningDeparture: '06:40 AM', afternoonDeparture: '03:45 PM', busNumber: 'STX-BUS-02' },
  { id: 'rt-3', routeName: 'Route C: Akobo – Bashorun – Iwo Road', coverageAreas: ['Akobo Estate', 'Bashorun', 'Iwo Road', 'Gate'], driverName: 'Mr. Segun Oladipo', contactNumber: '+234 805 112 4433', morningDeparture: '06:30 AM', afternoonDeparture: '03:45 PM', busNumber: 'STX-BUS-03' }
];

export const DEFAULT_MEAL_MENU: MealMenuItem[] = [
  { day: 'Monday', breakfast: 'Steamed Bean Cake (Moi-Moi) with Custard', lunch: 'Jollof Rice with Roasted Chicken & Fried Plantain', snack: 'Fresh Fruit Medley' },
  { day: 'Tuesday', breakfast: 'Toasted Wholewheat Sandwiches with Hot Chocolate', lunch: 'Pounded Yam with Vegetable Soup & Tender Beef', snack: 'Baked Meatpie & Juice' },
  { day: 'Wednesday', breakfast: 'Boiled Yam with Scrambled Egg Stew', lunch: 'Fried Rice with Crispy Turkey & Coleslaw', snack: 'Yogurt & Oat Biscuits' },
  { day: 'Thursday', breakfast: 'Pancakes with Maple Syrup & Boiled Eggs', lunch: 'Spaghetti Bolognese with Meatballs & Sweet Corn', snack: 'Banana Bread Slice' },
  { day: 'Friday', breakfast: 'Golden Corn Cereal with Milk & Toast', lunch: 'Fish Stew with White Rice & Steamed Greens', snack: 'Popcorn & Apple Slices' }
];

export const DEFAULT_CALENDAR_EVENTS: AcademicCalendarEvent[] = [
  // 1st Term (Michaelmas Term)
  { 
    id: 'ev-1', 
    title: '1st Term Resumption & Welcome Assembly', 
    date: '2026-09-15', 
    dateRange: 'Sep 15, 2026',
    term: '1st Term',
    category: 'Resumption', 
    type: 'Resumption',
    description: 'First day of the new term. Teachers commence the daily school attendance roll call.',
    notes: 'Official physical resumption for all day scholars and boarders.'
  },
  { 
    id: 'ev-2', 
    title: 'Continuous Assessment Tests (CA 1 & CA 2)', 
    date: '2026-10-19', 
    dateRange: 'Oct 19 – Oct 23, 2026',
    term: '1st Term',
    category: 'Exam', 
    type: 'Assessment',
    description: 'Evaluation of continuous assessment performance across all academic subjects.',
    notes: 'Subject tutors submit CA scores to the academic registry.'
  },
  { 
    id: 'ev-3', 
    title: 'Mid-Term Break (Open Days & PTA Consultation)', 
    date: '2026-10-29', 
    dateRange: 'Oct 29 – Nov 02, 2026',
    term: '1st Term',
    category: 'Holiday', 
    type: 'Holiday',
    description: 'Scholars on mid-term break while parents consult class teachers on academic progress.',
    notes: 'Parent-teacher conferences scheduled on Friday.'
  },
  { 
    id: 'ev-4', 
    title: 'Annual Inter-House Sports Gala', 
    date: '2026-11-14', 
    dateRange: 'Nov 14, 2026',
    term: '1st Term',
    category: 'Sports', 
    type: 'Sports',
    description: 'Track and field competitions across Blue, Red, Green, and Yellow houses.',
    notes: 'All parents, alumni, and supporters warmly invited.'
  },
  { 
    id: 'ev-5', 
    title: '1st Term Final Examinations', 
    date: '2026-12-01', 
    dateRange: 'Dec 01 – Dec 11, 2026',
    term: '1st Term',
    category: 'Exam', 
    type: 'Assessment',
    description: 'Terminal examinations across all primary and secondary arms.',
    notes: 'Strict exam invigilation and hall allocations.'
  },
  { 
    id: 'ev-6', 
    title: 'End of Term Vacation & Christmas Carol Concert', 
    date: '2026-12-18', 
    dateRange: 'Dec 18, 2026',
    term: '1st Term',
    category: 'Celebration', 
    type: 'Celebration',
    description: 'Prize-giving ceremony, musical pageant, and publication of terminal report cards.',
    notes: 'Vacation begins; vacation assignments dispatched.'
  },

  // 2nd Term (Lent Term)
  { 
    id: 'ev-7', 
    title: '2nd Term Resumption & Assembly', 
    date: '2027-01-11', 
    dateRange: 'Jan 11, 2027',
    term: '2nd Term',
    category: 'Resumption', 
    type: 'Resumption',
    description: 'Scholars return for Lent Term. Daily school attendance roll call commences.',
    notes: 'Roll call counter resets to Day 1 on resumption.'
  },
  { 
    id: 'ev-8', 
    title: 'Science, Robotics & Innovation Exhibition', 
    date: '2027-02-08', 
    dateRange: 'Feb 08 – Feb 12, 2027',
    term: '2nd Term',
    category: 'Celebration', 
    type: 'Academic',
    description: 'Annual STEM fair showcasing student robotic builds, code, and scientific research.',
    notes: 'Inter-class exhibitions and guest judging panel.'
  },
  { 
    id: 'ev-9', 
    title: '2nd Term Mid-Term Break & Open Days', 
    date: '2027-02-18', 
    dateRange: 'Feb 18 – Feb 22, 2027',
    term: '2nd Term',
    category: 'Holiday', 
    type: 'Holiday',
    description: 'Mid-term break for scholars and academic consultations for parents.',
    notes: 'Scholars resume fully on Monday Feb 23.'
  },
  { 
    id: 'ev-10', 
    title: '2nd Term Terminal & Mock Examinations', 
    date: '2027-03-15', 
    dateRange: 'Mar 15 – Mar 26, 2027',
    term: '2nd Term',
    category: 'Exam', 
    type: 'Assessment',
    description: 'Comprehensive examinations and BECE / WAEC mock testing series.',
    notes: 'Examinations across all junior and senior divisions.'
  },
  { 
    id: 'ev-11', 
    title: 'End of 2nd Term & Easter Holiday Vacation', 
    date: '2027-04-02', 
    dateRange: 'Apr 02, 2027',
    term: '2nd Term',
    category: 'Celebration', 
    type: 'Celebration',
    description: 'Terminal report card distribution and departure for Easter vacation.',
    notes: 'Easter holiday and preparatory break.'
  },

  // 3rd Term (Trinity Term)
  { 
    id: 'ev-12', 
    title: '3rd Term Resumption (Promotional Term)', 
    date: '2027-04-26', 
    dateRange: 'Apr 26, 2027',
    term: '3rd Term',
    category: 'Resumption', 
    type: 'Resumption',
    description: 'Scholars return for the critical promotional term. Daily roll call resumes.',
    notes: 'Final term of the academic session begins.'
  },
  { 
    id: 'ev-13', 
    title: 'Children\'s Day & Cultural Arts Gala', 
    date: '2027-05-27', 
    dateRange: 'May 27, 2027',
    term: '3rd Term',
    category: 'Celebration', 
    type: 'Celebration',
    description: 'Cultural parade celebrating linguistic diversity, national costumes, and performing arts.',
    notes: 'Traditional attire day and community feast.'
  },
  { 
    id: 'ev-14', 
    title: '3rd Term Mid-Term Break', 
    date: '2027-06-03', 
    dateRange: 'Jun 03 – Jun 07, 2027',
    term: '3rd Term',
    category: 'Holiday', 
    type: 'Holiday',
    description: 'Mid-term break and teacher continuous assessment harmonization.',
    notes: 'Three-day rest window for scholars.'
  },
  { 
    id: 'ev-15', 
    title: 'Annual Promotional Examinations', 
    date: '2027-06-21', 
    dateRange: 'Jun 21 – Jul 02, 2027',
    term: '3rd Term',
    category: 'Exam', 
    type: 'Assessment',
    description: 'Promotional examinations determining academic progression to the next grade.',
    notes: 'Includes practical laboratory tests and oral viva.'
  },
  { 
    id: 'ev-16', 
    title: 'Graduation Gala, Speech Day & Long Vacation', 
    date: '2027-07-16', 
    dateRange: 'Jul 16, 2027',
    term: '3rd Term',
    category: 'Celebration', 
    type: 'Celebration',
    description: 'Valedictory service, academic awards, graduation ceremony, and summer recess.',
    notes: 'Long vacation commences until September 2027.'
  }
];

export const ACADEMIC_PROGRAMS = DEFAULT_ACADEMIC_PROGRAMS;
export const FEATURED_COURSES = DEFAULT_FEATURED_COURSES;
export const CALENDAR_EVENTS = DEFAULT_CALENDAR_EVENTS;
export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. (Mrs.) Yinka Ajayi',
    relationship: 'Parent of SSS 2 Scholar',
    studentName: 'Tolu Ajayi',
    studentGrade: 'SSS 2 Science',
    comment: 'Stanbax Schools has exceeded our expectations. The dedication of the teachers, the transparent daily attendance tracking, and the robotics curriculum have made my daughter a passionate learner.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'test-2',
    name: 'Engr. Kenneth Eze',
    relationship: 'Parent of Primary 4 Scholar',
    studentName: 'Somto Eze',
    studentGrade: 'Primary 4',
    comment: 'The moral discipline and academic rigour are top-notch. When I receive the real-time attendance and assessment updates on the portal, I know my child is in safe, professional hands.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
  }
];

export const TESTIMONIALS = DEFAULT_TESTIMONIALS;

export const TUITION_SCHEDULE = {
  addons: {
    busService: {
      none: 0,
      "Ring Road / Challenge Area": 45000,
      "Bodija / Secretariat / Agodi": 55000,
      "Akobo / Iwo Road Corridor": 60000
    },
    mealPlan: {
      "Full Term Daily Hot Lunch": 50000
    },
    uniformSet: {
      "Full School Uniform + Sports Wear (2 pairs)": 35000
    },
    textbookPack: {
      "Standard Ministry Approved Textbook Pack": 45000
    },
    techFee: {
      "Robotics, ICT & Science Lab Consumables": 25000
    }
  }
};

// ==========================================
// 1. DEFAULT CBT EXAM VAULT
// ==========================================
export const DEFAULT_CBT_EXAMS: CbtExam[] = [
  {
    id: 'cbt-phy-ss2',
    title: 'SS 2 Physics Termly Mock Assessment (WAEC/NECO Standard)',
    subject: 'Physics',
    examType: 'TERM_MOCK',
    targetClass: 'SSS 2 Science',
    targetClassId: 'cls-14',
    durationMinutes: 30,
    passPercentage: 60,
    instructions: 'Answer all 6 objective questions. Select the most accurate option. Calculators and periodic tables may be referenced.',
    questions: [
      {
        id: 'q-phy-1',
        question: 'Which of the following is a scalar quantity?',
        options: ['Velocity', 'Electric Field Intensity', 'Electric Potential', 'Momentum'],
        correctOptionIndex: 2,
        explanation: 'Electric potential has magnitude only and requires no directional vector, making it a scalar quantity.',
        subject: 'Physics',
        topic: 'Scalars and Vectors'
      },
      {
        id: 'q-phy-2',
        question: 'A body of mass 5 kg falls freely from a height of 20 m. Calculate its velocity just before hitting the ground (g = 10 m/s²).',
        options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'],
        correctOptionIndex: 2,
        explanation: 'Using v² = u² + 2gh: v² = 0 + 2(10)(20) = 400. Therefore, v = √400 = 20 m/s.',
        subject: 'Physics',
        topic: 'Motion and Energy'
      },
      {
        id: 'q-phy-3',
        question: 'The unit of electrical capacitance in the SI system is named after which scientist?',
        options: ['James Prescott Joule', 'Michael Faraday', 'Nikola Tesla', 'Andre-Marie Ampere'],
        correctOptionIndex: 1,
        explanation: 'The SI unit of capacitance is the Farad (F), named in honour of Michael Faraday.',
        subject: 'Physics',
        topic: 'Current Electricity'
      },
      {
        id: 'q-phy-4',
        question: 'A concave mirror has a focal length of 15 cm. Where will the real, inverted image of an object placed 30 cm from the mirror be formed?',
        options: ['At 15 cm', 'At 30 cm (at the centre of curvature)', 'At 60 cm', 'At infinity'],
        correctOptionIndex: 1,
        explanation: 'When an object is placed at the centre of curvature (2f = 30 cm), its real inverted image is formed at the centre of curvature (30 cm).',
        subject: 'Physics',
        topic: 'Geometrical Optics'
      },
      {
        id: 'q-phy-5',
        question: 'Which electromagnetic radiation has the shortest wavelength and highest frequency?',
        options: ['Microwaves', 'Ultraviolet rays', 'Gamma rays', 'Infrared rays'],
        correctOptionIndex: 2,
        explanation: 'Gamma rays occupy the highest frequency end (>10¹⁹ Hz) with the shortest sub-atomic wavelengths.',
        subject: 'Physics',
        topic: 'Electromagnetic Spectrum'
      },
      {
        id: 'q-phy-6',
        question: 'The anomalous expansion of water occurs in the temperature interval between:',
        options: ['-4°C to 0°C', '0°C to 4°C', '4°C to 10°C', '96°C to 100°C'],
        correctOptionIndex: 1,
        explanation: 'Water contracts instead of expanding when heated from 0°C to 4°C, reaching its maximum density at 4°C.',
        subject: 'Physics',
        topic: 'Thermal Physics'
      }
    ]
  },
  {
    id: 'cbt-mth-bece',
    title: 'BECE / Junior WAEC Mathematics Speed Drills',
    subject: 'Mathematics',
    examType: 'BECE',
    targetClass: 'JSS 3',
    targetClassId: 'cls-12',
    durationMinutes: 20,
    passPercentage: 50,
    instructions: 'Attempt all foundational questions within the allotted time limit.',
    questions: [
      {
        id: 'q-mth-1',
        question: 'Solve for x: 3x - 7 = 14',
        options: ['5', '7', '8', '21'],
        correctOptionIndex: 1,
        explanation: '3x = 14 + 7 = 21 => x = 21 / 3 = 7.',
        subject: 'Mathematics',
        topic: 'Linear Equations'
      },
      {
        id: 'q-mth-2',
        question: 'What is the sum of angles in a quadrilateral?',
        options: ['180°', '270°', '360°', '540°'],
        correctOptionIndex: 2,
        explanation: 'The interior angles of any four-sided polygon sum to (4 - 2) * 180° = 360°.',
        subject: 'Mathematics',
        topic: 'Plane Geometry'
      },
      {
        id: 'q-mth-3',
        question: 'Find the prime factors of 42.',
        options: ['2, 3, 7', '1, 6, 7', '2, 4, 7', '3, 7, 9'],
        correctOptionIndex: 0,
        explanation: '42 = 2 * 3 * 7, all of which are prime numbers.',
        subject: 'Mathematics',
        topic: 'Number and Numeration'
      }
    ]
  },
  {
    id: 'cbt-eng-jamb',
    title: 'JAMB UTME English Language Use of English & Lexis',
    subject: 'English Language',
    examType: 'JAMB_UTME',
    targetClass: 'SSS 3 Science',
    targetClassId: 'cls-15',
    durationMinutes: 25,
    passPercentage: 65,
    instructions: 'Choose the option that is most nearly opposite in meaning to the italicized word or best completes the syntactic pattern.',
    questions: [
      {
        id: 'q-eng-1',
        question: 'Choose the word opposite in meaning: The doctor said the patient\'s condition was METEORIC in improvement.',
        options: ['Gradual', 'Rapid', 'Sudden', 'Stupendous'],
        correctOptionIndex: 0,
        explanation: 'Meteoric denotes swift or sudden rise; its antonym is gradual or slow.',
        subject: 'English Language',
        topic: 'Antonyms'
      },
      {
        id: 'q-eng-2',
        question: 'Neither the class prefect nor the students _____ aware of the rescheduled assembly.',
        options: ['was', 'were', 'is', 'has been'],
        correctOptionIndex: 1,
        explanation: 'In correlative conjunctions (neither... nor), the verb agrees with the nearer subject: "the students" (plural) takes "were".',
        subject: 'English Language',
        topic: 'Grammatical Concord'
      }
    ]
  }
];

// ==========================================
// 2. DEFAULT CLASS WEEKLY TIMETABLES
// ==========================================
export const DEFAULT_WEEKLY_TIMETABLES: ClassWeeklyTimetable[] = [
  {
    classId: 'cls-14',
    className: 'SSS 2 Science',
    schedule: [
      {
        day: 'Monday',
        periods: [
          { id: 'p-1', periodNumber: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'General Assembly & Devotion', tutorName: 'College Chaplaincy', isBreak: false, room: 'Assembly Hall' },
          { id: 'p-2', periodNumber: 2, startTime: '08:45 AM', endTime: '09:30 AM', subject: 'Physics', tutorName: 'Mr. Olumide Ogunleye', room: 'Physics Lab 1' },
          { id: 'p-3', periodNumber: 3, startTime: '09:30 AM', endTime: '10:15 AM', subject: 'Chemistry', tutorName: 'Dr. Chidi Okafor', room: 'Chemistry Lab' },
          { id: 'p-break', periodNumber: 4, startTime: '10:15 AM', endTime: '10:45 AM', subject: 'Morning Refreshment Break', tutorName: 'Duty Prefects', isBreak: true, room: 'Dining Quad' },
          { id: 'p-4', periodNumber: 5, startTime: '10:45 AM', endTime: '11:30 AM', subject: 'General Mathematics', tutorName: 'Mr. Olumide Ogunleye', room: 'Room 204' },
          { id: 'p-5', periodNumber: 6, startTime: '11:30 AM', endTime: '12:15 PM', subject: 'Further Mathematics', tutorName: 'Mr. Olumide Ogunleye', room: 'Room 204' },
          { id: 'p-6', periodNumber: 7, startTime: '12:15 PM', endTime: '01:00 PM', subject: 'English Language', tutorName: 'Mrs. Folake Adeyemi', room: 'Room 204' },
          { id: 'p-lunch', periodNumber: 8, startTime: '01:00 PM', endTime: '01:45 PM', subject: 'Hot Lunch & Siesta', tutorName: 'Boarding Stewards', isBreak: true, room: 'Dining Hall' },
          { id: 'p-7', periodNumber: 9, startTime: '01:45 PM', endTime: '02:30 PM', subject: 'Data Processing & Coding', tutorName: 'Mr. Olumide Ogunleye', room: 'ICT Innovation Lab' }
        ]
      },
      {
        day: 'Tuesday',
        periods: [
          { id: 't-1', periodNumber: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Biology Practicals', tutorName: 'Dr. (Mrs) Nkechi Nwosu', room: 'Biology Lab' },
          { id: 't-2', periodNumber: 2, startTime: '08:45 AM', endTime: '09:30 AM', subject: 'Biology Theory', tutorName: 'Dr. (Mrs) Nkechi Nwosu', room: 'Biology Lab' },
          { id: 't-3', periodNumber: 3, startTime: '09:30 AM', endTime: '10:15 AM', subject: 'English Language (Essay & Lexis)', tutorName: 'Mrs. Folake Adeyemi', room: 'Room 204' },
          { id: 't-break', periodNumber: 4, startTime: '10:15 AM', endTime: '10:45 AM', subject: 'Morning Snack Break', tutorName: 'Duty Master', isBreak: true },
          { id: 't-4', periodNumber: 5, startTime: '10:45 AM', endTime: '11:30 AM', subject: 'General Mathematics', tutorName: 'Mr. Olumide Ogunleye', room: 'Room 204' },
          { id: 't-5', periodNumber: 6, startTime: '11:30 AM', endTime: '12:15 PM', subject: 'Physics Lab Session', tutorName: 'Mr. Olumide Ogunleye', room: 'Physics Lab 1' },
          { id: 't-6', periodNumber: 7, startTime: '12:15 PM', endTime: '01:00 PM', subject: 'Civic Education', tutorName: 'Dr. Chukwuemeka Obi', room: 'Room 204' }
        ]
      },
      {
        day: 'Wednesday',
        periods: [
          { id: 'w-1', periodNumber: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Agricultural Science', tutorName: 'Mr. Emmanuel Danjuma', room: 'Agric Garden' },
          { id: 'w-2', periodNumber: 2, startTime: '08:45 AM', endTime: '09:30 AM', subject: 'Chemistry Practicals', tutorName: 'Dr. Chidi Okafor', room: 'Chemistry Lab' },
          { id: 'w-3', periodNumber: 3, startTime: '09:30 AM', endTime: '10:15 AM', subject: 'General Mathematics', tutorName: 'Mr. Olumide Ogunleye', room: 'Room 204' },
          { id: 'w-break', periodNumber: 4, startTime: '10:15 AM', endTime: '10:45 AM', subject: 'Morning Break', tutorName: 'Duty Master', isBreak: true },
          { id: 'w-4', periodNumber: 5, startTime: '10:45 AM', endTime: '11:30 AM', subject: 'Economics', tutorName: 'Dr. Chukwuemeka Obi', room: 'Room 204' },
          { id: 'w-5', periodNumber: 6, startTime: '11:30 AM', endTime: '01:00 PM', subject: 'Inter-House Sports & Clubs', tutorName: 'Sports Master', room: 'Sports Complex' }
        ]
      },
      {
        day: 'Thursday',
        periods: [
          { id: 'th-1', periodNumber: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Physics (Optics & Wave Motion)', tutorName: 'Mr. Olumide Ogunleye', room: 'Physics Lab 1' },
          { id: 'th-2', periodNumber: 2, startTime: '08:45 AM', endTime: '09:30 AM', subject: 'Chemistry (Organic Chemistry)', tutorName: 'Dr. Chidi Okafor', room: 'Chemistry Lab' },
          { id: 'th-3', periodNumber: 3, startTime: '09:30 AM', endTime: '10:15 AM', subject: 'English Oral & Phonetics', tutorName: 'Mrs. Folake Adeyemi', room: 'Language Lab' },
          { id: 'th-break', periodNumber: 4, startTime: '10:15 AM', endTime: '10:45 AM', subject: 'Break', tutorName: 'Duty Master', isBreak: true },
          { id: 'th-4', periodNumber: 5, startTime: '10:45 AM', endTime: '11:30 AM', subject: 'Computer & AI Robotics', tutorName: 'Mr. Olumide Ogunleye', room: 'ICT Innovation Lab' }
        ]
      },
      {
        day: 'Friday',
        periods: [
          { id: 'f-1', periodNumber: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Moral Instruction & Ethics', tutorName: 'Vice Principal', room: 'Assembly Hall' },
          { id: 'f-2', periodNumber: 2, startTime: '08:45 AM', endTime: '09:30 AM', subject: 'General Mathematics Quiz', tutorName: 'Mr. Olumide Ogunleye', room: 'Room 204' },
          { id: 'f-3', periodNumber: 3, startTime: '09:30 AM', endTime: '10:15 AM', subject: 'French & Foreign Language', tutorName: 'Madame DuPont', room: 'Room 204' },
          { id: 'f-break', periodNumber: 4, startTime: '10:15 AM', endTime: '10:45 AM', subject: 'Morning Snack', tutorName: 'Duty Master', isBreak: true },
          { id: 'f-4', periodNumber: 5, startTime: '10:45 AM', endTime: '11:45 AM', subject: 'College Societies & Debating', tutorName: 'Society Patrons', room: 'College Auditorium' },
          { id: 'f-5', periodNumber: 6, startTime: '11:45 AM', endTime: '01:00 PM', subject: 'Jumat / Christian Fellowship', tutorName: 'Chaplaincy', room: 'Faith Centers' }
        ]
      }
    ]
  }
];

// ==========================================
// 3. DEFAULT SICK-BAY MEDICAL LOGS
// ==========================================
export const DEFAULT_SICK_BAY_LOGS: SickBayVisitLog[] = [
  {
    id: 'sb-101',
    studentId: 'stu-1',
    studentName: 'Tiwa Adeleke',
    regNumber: 'STX/2023/042',
    grade: 'SSS 2 Science',
    visitDate: '2026-09-14',
    timeIn: '10:20 AM',
    timeOut: '11:45 AM',
    symptoms: 'Mild frontal headache and slight fatigue following physical exercise.',
    diagnosis: 'Mild exertion headache and dehydration.',
    treatmentAdministered: 'Paracetamol 500mg, oral rehydration salts (ORS), 45 minutes bed rest in air-conditioned bay.',
    temperatureCelsius: 36.8,
    nurseNotes: 'Scholar recovered fully after rest and rehydration. Vital signs stable (BP 110/70, Pulse 72). Discharged back to class.',
    parentNotified: false,
    admittedToBed: true,
    status: 'Discharged to Class'
  },
  {
    id: 'sb-102',
    studentId: 'stu-2',
    studentName: 'Babatunde Akindele',
    regNumber: 'STX/2023/043',
    grade: 'SSS 2 Science',
    visitDate: '2026-09-12',
    timeIn: '08:45 AM',
    timeOut: '10:15 AM',
    symptoms: 'Superficial skin abrasion on left knee sustained during football practice.',
    diagnosis: 'Minor sporting skin graze, clean wound edges.',
    treatmentAdministered: 'Wound irrigation with normal saline, povidone-iodine antiseptic dressing, adhesive sterile bandage.',
    temperatureCelsius: 36.6,
    nurseNotes: 'No deep tissue laceration or joint swelling. Scholar was cautioned to wear shin guards.',
    parentNotified: true,
    admittedToBed: false,
    status: 'Discharged to Class'
  }
];

// ==========================================
// 4. DEFAULT PARENTS & GUARDIANS DIRECTORY
// ==========================================
export const DEFAULT_PARENTS: ParentProfile[] = [
  {
    id: 'parent-1',
    fullName: 'Chief & Mrs. Adebayo Adeleke',
    phone: '+234 803 445 6789',
    email: 'adeleke.family@gmail.com',
    password: 'parent2025',
    address: 'Block 4, Agodi GRA, Ibadan, Oyo State',
    childrenIds: ['stu-1']
  },
  {
    id: 'parent-2',
    fullName: 'Engr. & Dr. Akindele',
    phone: '+234 802 887 6543',
    email: 'akindele.eng@yahoo.com',
    password: 'parent2025',
    address: '14 Oluyole Estate, Ring Road, Ibadan',
    childrenIds: ['stu-2']
  },
  {
    id: 'parent-3',
    fullName: 'Mr. & Mrs. Obinna Okafor',
    phone: '+234 809 112 3456',
    email: 'okafor.family@gmail.com',
    password: 'parent2025',
    address: 'Bodija Residential Quarters, Ibadan',
    childrenIds: ['stu-3']
  },
  {
    id: 'parent-4',
    fullName: 'Barrister Fashola',
    phone: '+234 805 776 5432',
    email: 'fashola.law@gmail.com',
    password: 'parent2025',
    address: 'Jericho GRA, Ibadan',
    childrenIds: ['stu-4']
  },
  {
    id: 'parent-5',
    fullName: 'Dr. Osas Oghomwen',
    phone: '+234 803 998 7766',
    email: 'oghomwen.clinic@gmail.com',
    password: 'parent2025',
    address: 'New Bodija Estate, Ibadan',
    childrenIds: ['stu-5']
  },
  {
    id: 'parent-6',
    fullName: 'Alhaji & Hajia Danjuma',
    phone: '+234 807 443 2211',
    email: 'danjuma.holdings@gmail.com',
    password: 'parent2025',
    address: 'Iyaganku Quarters, Ibadan',
    childrenIds: ['stu-6']
  },
  {
    id: 'parent-7',
    fullName: 'Mr. & Mrs. Bello',
    phone: '+234 802 334 5566',
    email: 'bello.family@gmail.com',
    password: 'parent2025',
    address: 'Akobo Estate, Ibadan',
    childrenIds: ['stu-7']
  },
  {
    id: 'parent-8',
    fullName: 'Chief Nnamdi',
    phone: '+234 805 667 8899',
    email: 'nnamdi.family@gmail.com',
    password: 'parent2025',
    address: 'Alalubosa Layout, Ibadan',
    childrenIds: ['stu-8']
  }
];

export const DEFAULT_PARENT_CONSULTATIONS: ParentConsultationRequest[] = [
  {
    id: 'req-001',
    parentId: 'parent-1',
    parentName: 'Chief & Mrs. Adebayo Adeleke',
    parentPhone: '+234 803 445 6789',
    studentId: 'stu-1',
    studentName: 'Tiwa Adeleke',
    targetRole: 'Guidance Counselor',
    recipientName: 'Dr. (Mrs) Nkechi Nwosu',
    preferredDate: '2026-09-22',
    preferredTime: '02:00 PM',
    topic: 'Career Pathway Consultation for Advanced STEM / Medicine Entry',
    message: 'We would like to consult with the guidance team regarding Tiwa\'s university choices for Cambridge A-Levels and international engineering applications.',
    status: 'Approved',
    adminResponse: 'Appointment scheduled with College Counselor on Tuesday Sept 22 at 2:00 PM in the Academic Boardroom.',
    createdAt: '2026-09-15'
  }
];

export const DEFAULT_FEE_PAYMENTS: FeePaymentRecord[] = [
  {
    id: 'fee-rec-901',
    receiptNumber: 'REC/2026/0842',
    studentId: 'stu-1',
    studentName: 'Tiwa Adeleke',
    regNumber: 'STX/2023/042',
    grade: 'SSS 2 Science',
    amount: 185000,
    term: '1st Term (Michaelmas Term)',
    session: '2026/2027 Academic Session',
    paymentMethod: 'Bank Transfer',
    reference: 'NIP/STX/20260916/8841',
    paymentDate: '2026-09-16',
    status: 'Verified',
    verifiedBy: 'Bursary Clearance Unit'
  },
  {
    id: 'fee-rec-902',
    receiptNumber: 'REC/2026/0843',
    studentId: 'stu-2',
    studentName: 'Babatunde Akindele',
    regNumber: 'STX/2023/043',
    grade: 'SSS 2 Science',
    amount: 185000,
    term: '1st Term (Michaelmas Term)',
    session: '2026/2027 Academic Session',
    paymentMethod: 'Online WebPay',
    reference: 'FLW/STX/20260917/4491',
    paymentDate: '2026-09-17',
    status: 'Verified',
    verifiedBy: 'Stanbax Automated Gateway'
  }
];

// ==========================================
// 5. DEFAULT DIGITAL LIBRARY & E-TEXTBOOKS
// ==========================================
export const DEFAULT_LIBRARY_BOOKS: LibraryBookItem[] = [
  {
    id: 'lib-01',
    title: 'WASSCE Comprehensive Physics Past Questions & Solutions (2018 - 2025)',
    author: 'WAEC Directorate of Test Development & Stanbax Faculty',
    category: 'WAEC Past Papers',
    subject: 'Physics',
    targetClass: 'SSS 1 - SSS 3',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    coverColor: 'from-blue-700 to-indigo-900',
    summary: 'Contains 7 years of full theory and objective examination questions with comprehensive step-by-step mathematical working and Chief Examiner remarks.',
    downloadsCount: 342,
    year: '2025 Edition'
  },
  {
    id: 'lib-02',
    title: 'JAMB UTME Mathematics Masterclass: 3,000 Solved MCQs',
    author: 'Prof. Adekunle Olawale & Stanbax STEM Department',
    category: 'JAMB Past Papers',
    subject: 'Mathematics',
    targetClass: 'SSS 2 - SSS 3',
    fileSize: '6.2 MB',
    fileType: 'PDF',
    coverColor: 'from-amber-600 to-red-800',
    summary: 'Speed strategies, shortcut algorithms, and high-frequency problem sets for high percentiles in JAMB UTME Mathematics.',
    downloadsCount: 512,
    year: '2026 Edition'
  },
  {
    id: 'lib-03',
    title: 'NECO SSCE Chemistry Standard Practical Manual & Qualitative Analysis Chart',
    author: 'Mrs. Folashade Adeyemi, Head of Sciences',
    category: 'NECO Past Papers',
    subject: 'Chemistry',
    targetClass: 'SSS 2 - SSS 3',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    coverColor: 'from-emerald-700 to-teal-900',
    summary: 'Color charts for flame tests, salt cation and anion detection reagents, redox titration calculations, and laboratory safety protocols.',
    downloadsCount: 289,
    year: '2025 Edition'
  },
  {
    id: 'lib-04',
    title: 'Cambridge IGCSE & WAEC Advanced English Lexis and Structure Anthology',
    author: 'Mrs. Grace Ekanem, Senior English Faculty',
    category: 'E-Textbook',
    subject: 'English Language',
    targetClass: 'SSS 1 - SSS 3',
    fileSize: '2.9 MB',
    fileType: 'PDF',
    coverColor: 'from-purple-700 to-indigo-950',
    summary: 'Exhaustive exploration of grammatical concord, phrasal verbs, idioms, figures of speech, and persuasive essay composition.',
    downloadsCount: 415,
    year: '2025 Edition'
  },
  {
    id: 'lib-05',
    title: 'Robotics & Python Programming STEM Lab Handbook for Young Innovators',
    author: 'Mr. Tunde Owolabi, ICT Director',
    category: 'STEM Lab Manual',
    subject: 'Data Processing & Coding',
    targetClass: 'JSS 1 - SSS 3',
    fileSize: '5.5 MB',
    fileType: 'PDF',
    coverColor: 'from-cyan-700 to-blue-900',
    summary: 'Hands-on projects for Arduino microcontrollers, sensor integration, Python loops, and algorithmic problem-solving.',
    downloadsCount: 198,
    year: '2026 Edition'
  }
];

// ==========================================
// 6. DEFAULT CBT ATTEMPTS (For Leaderboards)
// ==========================================
export const DEFAULT_CBT_ATTEMPTS: CbtAttempt[] = [
  {
    id: 'att-seed-1',
    examId: 'cbt-phy-ss2',
    examTitle: 'SS 2 Physics Termly Mock Assessment (WAEC/NECO Standard)',
    subject: 'Physics',
    studentId: 'stu-3',
    studentName: 'Chidera Okafor',
    score: 6,
    totalQuestions: 6,
    percentage: 100,
    passed: true,
    dateAttempted: '2026-09-21T10:15:00.000Z',
    answers: { 'q-phy-1': 2, 'q-phy-2': 2, 'q-phy-3': 1, 'q-phy-4': 1, 'q-phy-5': 2, 'q-phy-6': 1 }
  },
  {
    id: 'att-seed-2',
    examId: 'cbt-phy-ss2',
    examTitle: 'SS 2 Physics Termly Mock Assessment (WAEC/NECO Standard)',
    subject: 'Physics',
    studentId: 'stu-1',
    studentName: 'Tiwa Adeleke',
    score: 5,
    totalQuestions: 6,
    percentage: 83,
    passed: true,
    dateAttempted: '2026-09-21T11:45:00.000Z',
    answers: { 'q-phy-1': 2, 'q-phy-2': 2, 'q-phy-3': 1, 'q-phy-4': 1, 'q-phy-5': 2, 'q-phy-6': 0 }
  },
  {
    id: 'att-seed-3',
    examId: 'cbt-phy-ss2',
    examTitle: 'SS 2 Physics Termly Mock Assessment (WAEC/NECO Standard)',
    subject: 'Physics',
    studentId: 'stu-5',
    studentName: 'Efe Oghomwen',
    score: 5,
    totalQuestions: 6,
    percentage: 83,
    passed: true,
    dateAttempted: '2026-09-22T09:20:00.000Z',
    answers: { 'q-phy-1': 2, 'q-phy-2': 2, 'q-phy-3': 1, 'q-phy-4': 0, 'q-phy-5': 2, 'q-phy-6': 1 }
  },
  {
    id: 'att-seed-4',
    examId: 'cbt-phy-ss2',
    examTitle: 'SS 2 Physics Termly Mock Assessment (WAEC/NECO Standard)',
    subject: 'Physics',
    studentId: 'stu-2',
    studentName: 'Babatunde Akindele',
    score: 4,
    totalQuestions: 6,
    percentage: 67,
    passed: true,
    dateAttempted: '2026-09-22T14:10:00.000Z',
    answers: { 'q-phy-1': 2, 'q-phy-2': 0, 'q-phy-3': 1, 'q-phy-4': 1, 'q-phy-5': 0, 'q-phy-6': 1 }
  },
  {
    id: 'att-seed-5',
    examId: 'cbt-eng-jamb',
    examTitle: 'JAMB UTME English Language Use of English & Lexis',
    subject: 'English Language',
    studentId: 'stu-1',
    studentName: 'Tiwa Adeleke',
    score: 2,
    totalQuestions: 2,
    percentage: 100,
    passed: true,
    dateAttempted: '2026-09-23T08:30:00.000Z',
    answers: { 'q-eng-1': 0, 'q-eng-2': 1 }
  },
  {
    id: 'att-seed-6',
    examId: 'cbt-mth-bece',
    examTitle: 'BECE / Junior WAEC Mathematics Speed Drills',
    subject: 'Mathematics',
    studentId: 'stu-7',
    studentName: 'Amina Bello',
    score: 3,
    totalQuestions: 3,
    percentage: 100,
    passed: true,
    dateAttempted: '2026-09-20T16:00:00.000Z',
    answers: { 'q-mth-1': 1, 'q-mth-2': 2, 'q-mth-3': 0 }
  },
  {
    id: 'att-seed-7',
    examId: 'cbt-mth-bece',
    examTitle: 'BECE / Junior WAEC Mathematics Speed Drills',
    subject: 'Mathematics',
    studentId: 'stu-8',
    studentName: 'Kenechukwu Nnamdi',
    score: 2,
    totalQuestions: 3,
    percentage: 67,
    passed: true,
    dateAttempted: '2026-09-21T15:20:00.000Z',
    answers: { 'q-mth-1': 1, 'q-mth-2': 0, 'q-mth-3': 0 }
  }
];

// ==========================================
// 7. DEFAULT COMMUNITY CHAT CHANNELS
// ==========================================
export const DEFAULT_CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'chan-gen-announcement',
    name: 'Official School Announcements',
    type: 'announcement',
    description: 'Universal administrative bulletin for scholars, tutors, and guardians.',
    createdAt: '2026-09-01T08:00:00.000Z',
    createdBy: 'admin-1',
    isReadOnly: true
  },
  {
    id: 'chan-cls-sss2',
    name: 'SSS 2 Science — Class Forum',
    type: 'class',
    description: 'Daily academic debates, peer study groups, and classroom updates.',
    classId: 'cls-14',
    className: 'SSS 2 Science',
    createdAt: '2026-09-01T08:00:00.000Z',
    createdBy: 'admin-1'
  },
  {
    id: 'chan-cls-jss1',
    name: 'JSS 1 — Class Forum',
    type: 'class',
    description: 'Junior secondary scholars collaborative discussions.',
    classId: 'cls-10',
    className: 'JSS 1',
    createdAt: '2026-09-01T08:00:00.000Z',
    createdBy: 'admin-1'
  },
  {
    id: 'chan-club-jets',
    name: 'JETS Science & Robotics Club',
    type: 'club',
    description: 'Prototyping, robotics experiments, Olympiad prep, and circuit design.',
    clubId: 'cl-1',
    clubName: 'JETS Science & Robotics Club',
    createdAt: '2026-09-01T08:00:00.000Z',
    createdBy: 'admin-1'
  },
  {
    id: 'chan-club-debate',
    name: 'Literary & Debating Society',
    type: 'club',
    description: 'Oratory tournaments, mock parliaments, and essay symposiums.',
    clubId: 'cl-2',
    clubName: 'Literary & Debating Society',
    createdAt: '2026-09-01T08:00:00.000Z',
    createdBy: 'admin-1'
  },
  {
    id: 'chan-club-press',
    name: 'Press & Media Club',
    type: 'club',
    description: 'Termly gazette publishing, journalism, and photography.',
    clubId: 'cl-4',
    clubName: 'Press & Media Club',
    createdAt: '2026-09-01T08:00:00.000Z',
    createdBy: 'admin-1'
  },
  {
    id: 'chan-dm-parent-tutor',
    name: 'Guardian Link: Chief Adeleke & Mr. Ogunleye',
    type: 'direct',
    description: 'Authorized private consultation channel between parent and appointed faculty tutor.',
    directParticipantIds: ['parent-1', 'tut-1', 'admin-1'],
    directParticipantNames: ['Chief & Mrs. Adebayo Adeleke (Parent)', 'Mr. Olumide Ogunleye (Form Master)'],
    createdAt: '2026-09-15T09:00:00.000Z',
    createdBy: 'admin-1'
  },
  {
    id: 'chan-dm-student-tutor',
    name: 'Academic Mentorship: Tiwa Adeleke & Dr. Obi',
    type: 'direct',
    description: 'Private academic consultation and Olympiad mentoring.',
    directParticipantIds: ['stu-1', 'tut-3', 'admin-1'],
    directParticipantNames: ['Tiwa Adeleke (Scholar)', 'Dr. Chukwuemeka Obi (Tutor)'],
    createdAt: '2026-09-18T14:00:00.000Z',
    createdBy: 'admin-1'
  },
  {
    id: 'chan-dm-student-peer',
    name: 'Private Peer Study: Tiwa Adeleke & Tobi Alabi',
    type: 'direct',
    description: 'Private student-to-student study dialogue between SSS 2 classmates.',
    directParticipantIds: ['stu-1', 'stu-2', 'admin-1'],
    directParticipantNames: ['Tiwa Adeleke (Scholar)', 'Tobi Alabi (Scholar)'],
    createdAt: '2026-09-20T10:00:00.000Z',
    createdBy: 'stu-1'
  }
];

// ==========================================
// 8. DEFAULT COMMUNITY CHAT MESSAGES
// ==========================================
export const DEFAULT_CHAT_MESSAGES: SchoolChatMessage[] = [
  {
    id: 'msg-ann-1',
    channelId: 'chan-gen-announcement',
    senderId: 'admin-1',
    senderName: 'Principal Administrator',
    senderRole: 'admin',
    senderSubtext: 'Stanbax Central Registry',
    content: 'Good morning scholars, esteemed tutors, and parents! Continuous Assessment tests and CBT simulations are active this week. Please review your weekly timetables and prepare diligently.',
    timestamp: '2026-09-22T07:45:00.000Z'
  },
  {
    id: 'msg-cls-1',
    channelId: 'chan-cls-sss2',
    senderId: 'tut-1',
    senderName: 'Mr. Olumide Ogunleye',
    senderRole: 'tutor',
    senderSubtext: 'Physics Tutor & Form Master',
    content: 'Welcome SSS 2 scholars! The laboratory practical on Snell’s Law and optical refraction will take place on Thursday at 10:15 AM. Ensure your lab coats and graph sheets are ready.',
    timestamp: '2026-09-22T08:15:00.000Z'
  },
  {
    id: 'msg-cls-2',
    channelId: 'chan-cls-sss2',
    senderId: 'stu-1',
    senderName: 'Tiwa Adeleke',
    senderRole: 'student',
    senderSubtext: 'SSS 2 Science (Class Prefect)',
    content: 'Noted, Sir! I have coordinated with the lab steward. We have 20 triangular glass prisms and ray boxes prepared for the experiment.',
    timestamp: '2026-09-22T08:22:00.000Z'
  },
  {
    id: 'msg-cls-3',
    channelId: 'chan-cls-sss2',
    senderId: 'stu-3',
    senderName: 'Chidera Okafor',
    senderRole: 'student',
    senderSubtext: 'SSS 2 Science',
    content: 'Has anyone finished question 7 on the Kinematics assignment? The projectile formula for horizontal range is yielding 120m for me.',
    timestamp: '2026-09-22T16:40:00.000Z'
  },
  {
    id: 'msg-cls-4',
    channelId: 'chan-cls-sss2',
    senderId: 'stu-2',
    senderName: 'Babatunde Akindele',
    senderRole: 'student',
    senderSubtext: 'SSS 2 Science',
    content: 'Yes Chidera! Using R = (u² sin 2θ) / g gives 120 metres exactly at 45 degrees initial launch angle.',
    timestamp: '2026-09-22T17:05:00.000Z'
  },
  {
    id: 'msg-club-1',
    channelId: 'chan-club-jets',
    senderId: 'tut-1',
    senderName: 'Mr. Olumide Ogunleye',
    senderRole: 'tutor',
    senderSubtext: 'JETS Faculty Patron',
    content: 'Congratulations to our JETS Arduino robotics team for passing stage 1 of the National Science Olympiad! Meeting this Wednesday at 3:00 PM in the ICT Innovation Lab.',
    timestamp: '2026-09-23T09:10:00.000Z'
  },
  {
    id: 'msg-club-2',
    channelId: 'chan-club-jets',
    senderId: 'stu-1',
    senderName: 'Tiwa Adeleke',
    senderRole: 'student',
    senderSubtext: 'JETS Project Lead',
    content: 'Thank you Sir! We have already coded the autonomous obstacle-avoidance ultrasonic algorithm in Python and C++.',
    timestamp: '2026-09-23T09:30:00.000Z'
  },
  {
    id: 'msg-dm-1',
    channelId: 'chan-dm-parent-tutor',
    senderId: 'parent-1',
    senderName: 'Chief Adebayo Adeleke',
    senderRole: 'parent',
    senderSubtext: 'Parent of Tiwa Adeleke',
    content: 'Good afternoon Mr. Ogunleye. We noticed Tiwa’s outstanding result in the Physics CBT simulation. We would like to confirm the schedule for the upcoming Cambridge IGCSE revision seminars.',
    timestamp: '2026-09-23T13:15:00.000Z'
  },
  {
    id: 'msg-dm-2',
    channelId: 'chan-dm-parent-tutor',
    senderId: 'tut-1',
    senderName: 'Mr. Olumide Ogunleye',
    senderRole: 'tutor',
    senderSubtext: 'Senior Physics Faculty',
    content: 'Good day Chief Adeleke. Tiwa’s analytical aptitude is exemplary! The IGCSE masterclass runs every Saturday 9:00 AM – 12:00 PM. All learning modules have been uploaded to the Digital Library.',
    timestamp: '2026-09-23T14:00:00.000Z'
  },
  {
    id: 'msg-dm-peer-1',
    channelId: 'chan-dm-student-peer',
    senderId: 'stu-1',
    senderName: 'Tiwa Adeleke',
    senderRole: 'student',
    senderSubtext: 'SSS 2 Scholar',
    content: 'Hi Tobi! Have you worked through the calculus differentiation exercise for Week 3? I am reviewing the quadratic factorizations right now.',
    timestamp: '2026-09-23T16:00:00.000Z'
  },
  {
    id: 'msg-dm-peer-2',
    channelId: 'chan-dm-student-peer',
    senderId: 'stu-2',
    senderName: 'Tobi Alabi',
    senderRole: 'student',
    senderSubtext: 'SSS 2 Scholar',
    content: 'Hello Tiwa! Yes, I solved questions 1 to 5. Let’s compare our working steps during free prep period in the library tomorrow.',
    timestamp: '2026-09-23T16:15:00.000Z'
  },
  {
    id: 'msg-dm-peer-3',
    channelId: 'chan-dm-student-peer',
    senderId: 'stu-1',
    senderName: 'Tiwa Adeleke',
    senderRole: 'student',
    senderSubtext: 'SSS 2 Scholar',
    content: 'Sounds great! Calvin AI gave me a clear step-by-step derivation for the turning points too.',
    timestamp: '2026-09-23T16:20:00.000Z'
  }
];

// ==========================================
// 6. DEFAULT SCHOOL REPRESENTATIVE & VISITOR INQUIRIES
// ==========================================
export const DEFAULT_SCHOOL_REP_CONFIG: SchoolRepConfig = {
  activeRole: 'principal',
  repName: 'Mrs. Bello',
  repTitle: 'School Principal & Head of Administration',
  repAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  isAvailable: false, // Default: Calvin AI acts as representative when rep is offline!
  welcomeMessage: 'Welcome to Stanbax Schools Ibadan! I am Mrs. Bello, Principal. How may we assist your family today with admissions, entrance examinations, bursary schedules, or our British-Nigerian curriculum?',
  contactPhone: '+234 803 123 4567',
  contactEmail: 'admissions@stanbaxschools.edu.ng',
  statusText: 'Away on Campus Inspection • Calvin AI Virtual Rep Active',
  officeHours: 'Monday – Friday, 8:00 AM – 4:30 PM'
};

export const DEFAULT_VISITOR_CONVERSATIONS: VisitorConversation[] = [];



