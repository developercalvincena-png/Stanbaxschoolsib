import { 
  PrivilegeDefinition, 
  PrivilegeKey, 
  RolePrivilegeSettings, 
  HeadmistressProfile, 
  ModeratorProfile 
} from '../types';

export const ALL_PRIVILEGES: PrivilegeDefinition[] = [
  {
    key: 'manage_students',
    label: 'Scholars & Admissions',
    category: 'Academics & Faculty',
    description: 'Register scholars, modify profiles, promote academic years, and manage alumni status.'
  },
  {
    key: 'manage_faculty',
    label: 'Faculty Staff & Assignments',
    category: 'Academics & Faculty',
    description: 'Inspect faculty educators, assign subject classes, and configure teacher profiles.'
  },
  {
    key: 'academic_curriculum',
    label: 'Curriculum & Schemes of Work',
    category: 'Academics & Faculty',
    description: 'Audit terminal schemes of work, review weekly curriculum matrices, and approve lesson notes.'
  },
  {
    key: 'terminal_results',
    label: 'Terminal Results Collation',
    category: 'Academics & Faculty',
    description: 'Collate CA tests and terminal exams, compute positions, and generate official report cards.'
  },
  {
    key: 'exam_cbt_studio',
    label: 'AI Exam & CBT Assessment Studio',
    category: 'Academics & Faculty',
    description: 'Create terminal exams with difficulty toggles, CBT mock quizzes, and confidential marking aids.'
  },
  {
    key: 'community_chat_moderation',
    label: 'Community & Live Chat Moderation',
    category: 'Communications & Chat',
    description: 'Monitor student/parent chat channels, delete inappropriate messages, and mute violators.'
  },
  {
    key: 'visitor_inquiries',
    label: 'School Representative & Inquiries Desk',
    category: 'Communications & Chat',
    description: 'Act as official school representative for prospective parents, live chat, and consultations.'
  },
  {
    key: 'broadcasts_notices',
    label: 'Parent Broadcasts & School Notices',
    category: 'Communications & Chat',
    description: 'Draft and publish official school notices, SMS/email parent broadcasts, and newsletters.'
  },
  {
    key: 'school_calendar',
    label: 'Term Calendar & Events',
    category: 'Operations & Administration',
    description: 'Manage academic calendar, schedule school holidays, and set term resumption dates.'
  },
  {
    key: 'campus_gallery',
    label: 'Campus Media & Photo Gallery',
    category: 'Operations & Administration',
    description: 'Upload, caption, and curate campus photos across sports, arts, and academic categories.'
  },
  {
    key: 'prefect_badges',
    label: 'Prefect & Leadership Badges',
    category: 'Operations & Administration',
    description: 'Appoint school prefects, assign leadership badges, and manage student government councils.'
  },
  {
    key: 'financial_records',
    label: 'Tuition Fees & Payments',
    category: 'Security & Finance',
    description: 'Inspect class fee schedules, monitor outstanding balances, and issue payment receipts.'
  },
  {
    key: 'credentials_vault',
    label: 'Credentials Vault & Password Resets',
    category: 'Security & Finance',
    description: 'View institutional credentials directory and perform emergency user password resets.'
  }
];

export const DEFAULT_ROLE_PRIVILEGES: RolePrivilegeSettings = {
  headmistress: {
    manage_students: true,
    manage_faculty: true,
    academic_curriculum: true,
    terminal_results: true,
    exam_cbt_studio: true,
    community_chat_moderation: true,
    visitor_inquiries: true,
    broadcasts_notices: true,
    school_calendar: true,
    campus_gallery: true,
    prefect_badges: true,
    financial_records: false,
    credentials_vault: false
  },
  moderator: {
    manage_students: false,
    manage_faculty: false,
    academic_curriculum: false,
    terminal_results: false,
    exam_cbt_studio: false,
    community_chat_moderation: true,
    visitor_inquiries: true,
    broadcasts_notices: true,
    school_calendar: false,
    campus_gallery: true,
    prefect_badges: false,
    financial_records: false,
    credentials_vault: false
  },
  tutor: {
    manage_students: false,
    manage_faculty: false,
    academic_curriculum: true,
    terminal_results: true,
    exam_cbt_studio: true,
    community_chat_moderation: false,
    visitor_inquiries: false,
    broadcasts_notices: false,
    school_calendar: false,
    campus_gallery: false,
    prefect_badges: false,
    financial_records: false,
    credentials_vault: false
  },
  student: {
    manage_students: false,
    manage_faculty: false,
    academic_curriculum: false,
    terminal_results: false,
    exam_cbt_studio: false,
    community_chat_moderation: false,
    visitor_inquiries: false,
    broadcasts_notices: false,
    school_calendar: false,
    campus_gallery: false,
    prefect_badges: false,
    financial_records: false,
    credentials_vault: false
  },
  parent: {
    manage_students: false,
    manage_faculty: false,
    academic_curriculum: false,
    terminal_results: false,
    exam_cbt_studio: false,
    community_chat_moderation: false,
    visitor_inquiries: false,
    broadcasts_notices: false,
    school_calendar: false,
    campus_gallery: false,
    prefect_badges: false,
    financial_records: false,
    credentials_vault: false
  }
};

export const DEFAULT_HEADMISTRESS_PROFILE: HeadmistressProfile = {
  name: 'Mrs. Funmilayo Adediran',
  title: 'Head Mistress / Academic Principal',
  email: 'headmistress@stanbaxschools.edu.ng',
  phone: '+234 803 456 7890',
  qualification: 'B.Ed (Hons), M.Ed (Educational Leadership & Administration), TRCN Fellow',
  welcomeMessage: 'Welcome to Stanbax Schools Ibadan. As Head Mistress, my mission is nurturing disciplined, academically sound, and God-fearing future leaders equipped to make global impact.'
};

export const DEFAULT_MODERATORS: ModeratorProfile[] = [
  {
    id: 'mod-1',
    name: 'Mr. Kehinde Badmus',
    email: 'moderator@stanbaxschools.edu.ng',
    phone: '+234 802 345 6789',
    roleTitle: 'Chief Community & Communications Moderator',
    assignedSections: ['School Live Chat', 'Visitor Desk', 'Broadcasts & Gallery'],
    status: 'Active'
  }
];
