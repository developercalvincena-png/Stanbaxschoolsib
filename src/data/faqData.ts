import { FAQItem, FAQSectionContent } from '../types';

export const DEFAULT_FAQ_CONTENT: FAQSectionContent = {
  badge: 'Frequently Asked Questions',
  title: 'Got Questions? We Have Answers',
  subtitle: 'Find comprehensive answers regarding admissions, curriculum, school schedule, tuition, and facilities at Stanbax Schools.'
};

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Admissions',
    question: 'How do I register my child for admission at Stanbax Schools?',
    answer: 'Admissions can be initiated online via our admissions portal or by visiting the school administrative office. After submitting the application form, an entrance screening date is scheduled.'
  },
  {
    id: 'faq-2',
    category: 'Academics',
    question: 'What curriculum does Stanbax Schools follow?',
    answer: 'We operate an enriched hybrid curriculum blending the Nigerian National Curriculum (NERDC) with British Cambridge curriculum frameworks to foster global competence and high academic standards.'
  },
  {
    id: 'faq-3',
    category: 'Tuition & Fees',
    question: 'Are there flexible payment options for tuition fees?',
    answer: 'Yes, Stanbax Schools offers structured installment payment options per term in arrangement with the school bursary department before term resumption.'
  },
  {
    id: 'faq-4',
    category: 'Facilities',
    question: 'What safety and campus facilities are provided?',
    answer: 'We maintain secure fenced school grounds, CCTV coverage, biometric/vetted access gates, round-the-clock trained security personnel, and a fully equipped staffed health clinic.'
  },
  {
    id: 'faq-5',
    category: 'Extracurricular',
    question: 'What sports and clubs are available for students?',
    answer: 'Students can participate in soccer, swimming, athletics, robotics, music, coding club, debate society, press club, and JETS science club.'
  }
];
