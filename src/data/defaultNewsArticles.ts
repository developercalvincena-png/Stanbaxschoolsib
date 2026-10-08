import { SchoolNewsArticle } from '../types';

export const DEFAULT_NEWS_ARTICLES: SchoolNewsArticle[] = [
  {
    id: 'news-1',
    title: 'Stanbax Robotics & AI Team Clinches 1st Place at South-West Regional STEM Olympiad',
    slug: 'stanbax-robotics-team-wins-southwest-stem-olympiad',
    excerpt: 'Our Senior JETS innovators engineered an autonomous solar-powered micro-irrigation system and telemetry rover, outperforming 42 colleges in Lagos.',
    content: `The Stanbax Junior Engineers, Technicians & Scientists (JETS) society has brought immense prestige to the institution by clinching the overall Gold Trophy at the 2026 South-West Regional STEM Olympiad held at the University of Lagos Multipurpose Hall.\n\nLed by Senior Secondary lead engineers under the patronship of Mr. Olumide Ogunleye, the five-student delegation showcased an autonomous agricultural telemetry drone paired with ground-sensor micro-controllers designed to optimize irrigation and soil moisture retention for tropical cassava and maize farming.\n\n"We built the algorithm using computer vision and lightweight micro-controllers right here in our school science laboratories," noted the project lead. "The judges commended our code efficiency, mechanical durability, and adherence to clean energy principles."\n\nThe Proprietress and Principal Administrator jointly announced a special commendation scholarship for all five team members and approved an additional seed grant for the school engineering laboratory ahead of the National Finals in Abuja.`,
    category: 'STEM & Innovation',
    coverImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2026-09-24T08:30:00.000Z',
    readTime: '4 min read',
    author: {
      id: 'stu-1',
      name: 'Tiwa Adeleke',
      role: 'Press Club President',
      gradeOrTitle: 'SSS 2 Science • Press President'
    },
    tags: ['Robotics', 'STEM', 'JETS Club', 'Regional Award', 'Innovation'],
    isFeatured: true,
    likesCount: 142,
    viewsCount: 680
  },
  {
    id: 'news-2',
    title: 'Stanbax Scholars Record 98.4% Distinction Rate in Cambridge IGCSE & WAEC Mock Trials',
    slug: 'cambridge-igcse-waec-mock-trials-record-distinctions',
    excerpt: 'Comprehensive diagnostic assessment reports confirm outstanding mastery across Further Mathematics, Physics, English Language, and Economics.',
    content: `The Academic Directorate has officially released the performance analysis for the 2026 Terminal Mock Assessments, reflecting extraordinary distinction metrics across both the British National Curriculum and Nigerian WAEC senior secondary syllabi.\n\nOut of 128 registered candidates in SSS 3, 98.4% earned distinctions (A1–B3 equivalents) across core subjects, with unanimous 100% credit passes in Mathematics, English Language, Biology, and Economics.\n\nDirector of Studies, Dr. Chukwuemeka Obi, attributed the stellar results to the personalized learning intervention powered by Calvin AI study schemes, weekend past-question masterclasses, and intensive experimental laboratory drills.\n\n"Our students have built intellectual resilience. They understand not merely how to memorize marking schemes, but how to deduce underlying scientific and literary principles," Dr. Obi commented during the academic review assembly.`,
    category: 'Academic Honors',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2026-09-21T10:15:00.000Z',
    readTime: '3 min read',
    author: {
      id: 'stu-2',
      name: 'Babatunde Akindele',
      role: 'Press Club Editor',
      gradeOrTitle: 'SSS 2 Science • News Desk'
    },
    tags: ['WAEC', 'Cambridge IGCSE', 'Academic Excellence', 'Mock Exams'],
    isFeatured: false,
    likesCount: 98,
    viewsCount: 512
  },
  {
    id: 'news-3',
    title: 'Inter-House Sports Championship: Sapphire House Clinches Golden Relay Trophy in Thrilling Finale',
    slug: 'inter-house-sports-championship-sapphire-house-victory',
    excerpt: 'Excitement filled the main campus sports arena as Sapphire, Ruby, Emerald, and Gold houses battled across 24 track and field disciplines.',
    content: `The 14th Annual Stanbax Inter-House Athletics and Field Games concluded on Saturday with Sapphire House emerging as champions following a decisive victory in the senior 4x100m invitation relay.\n\nWith parents, alumni, and distinguished board trustees cheering from the grand pavilion, athletes showcased athletic prowess across sprint dashes, hurdles, high jump, shot put, and traditional house march-pasts.\n\nRuby House took a commendable second place after dominating the middle-distance 800m and javelin events, while Emerald House clinched the award for the Most Disciplined Contingent during the ceremonial opening parade.\n\nSports Prefect and House Captains were decorated with commemorative medals by the Principal Administrator, while the school brass band provided stirring musical fanfares throughout the ceremony.`,
    category: 'Sports Desk',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2026-09-18T16:00:00.000Z',
    readTime: '4 min read',
    author: {
      id: 'stu-3',
      name: 'Chinedu Eze',
      role: 'Press Club Editor',
      gradeOrTitle: 'SSS 1 Arts • Sports Desk'
    },
    tags: ['Inter-House Sports', 'Athletics', 'Sapphire House', 'Relay', 'Physical Education'],
    isFeatured: false,
    likesCount: 176,
    viewsCount: 840
  },
  {
    id: 'news-4',
    title: 'Literary & Debating Society Hosts Inter-Collegiate Oratory Colloquium on Ethics and Artificial Intelligence',
    slug: 'literary-debating-society-oratory-colloquium',
    excerpt: 'Delegates from six secondary schools tackled national youth empowerment, digital literacy, and the role of ethical technology in African classrooms.',
    content: `The Stanbax Auditorium served as the intellectual hub for the 2026 Inter-Collegiate Oratory Colloquium organized by the Literary and Debating Society.\n\nDebaters engaged in debate over the proposition: "Resolved: Artificial Intelligence in Primary and Secondary Classrooms Accelerates Critical Thinking Rather Than Diminishes Cognitive Rigor."\n\nStanbax chief speaker presented compelling evidence from classroom scheme-of-work pilot testing, illustrating how AI-guided question tutors enable students to practice advanced derivations independently outside regular school hours.\n\nThe guest adjudicators, including faculty lecturers from the University Department of English and Communications, commended the participants for exemplary elocution, cross-examination rebuttals, and persuasive rhetorical poise.`,
    category: 'Arts & Culture',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2026-09-14T11:45:00.000Z',
    readTime: '3 min read',
    author: {
      id: 'stu-1',
      name: 'Tiwa Adeleke',
      role: 'Press Club President',
      gradeOrTitle: 'SSS 2 Science • Press President'
    },
    tags: ['Debate', 'Literary Society', 'Oratory', 'Public Speaking'],
    isFeatured: false,
    likesCount: 114,
    viewsCount: 460
  },
  {
    id: 'news-5',
    title: 'Commissioning of the Ultra-Modern Language Laboratory & E-Library Terminal',
    slug: 'commissioning-of-language-lab-and-elibrary',
    excerpt: 'State-of-the-art acoustic phonetics headsets, digital audio consoles, and NERDC digital textbooks installed to enhance linguistic fluency.',
    content: `In line with our commitment to international bilingual standards, Stanbax Schools has officially commissioned its refurbished Language Laboratory and E-Library Resource Suite on the second floor of the Academic Wing.\n\nThe specialized facility features 40 networked acoustic audio booths equipped with master recording consoles for French, Yoruba, and English phonetics drills, along with direct terminals linked to academic research repositories and past examination archives.\n\n"Mastery of verbal articulation and reading comprehension is foundational to all academic and diplomatic pursuits," stated the School Proprietress during the ceremonial ribbon-cutting. "This new terminal gives every scholar the tools to speak and write with global confidence."`,
    category: 'Campus News',
    coverImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2026-09-10T09:20:00.000Z',
    readTime: '3 min read',
    author: {
      id: 'tut-1',
      name: 'Mr. Olumide Ogunleye',
      role: 'Staff Patron',
      gradeOrTitle: 'Senior Master & Press Patron'
    },
    tags: ['E-Library', 'Language Lab', 'Infrastructure', 'Facilities'],
    isFeatured: false,
    likesCount: 88,
    viewsCount: 390
  },
  {
    id: 'news-6',
    title: 'Principal’s Address: Academic Discipline, Integrity, and Pastoral Safety for the New Term',
    slug: 'principals-address-discipline-integrity-pastoral-care',
    excerpt: 'Principal Administrator issues official directive on prompt resumption, dress code perfection, and zero-tolerance policies on academic dishonesty.',
    content: `As we cross the mid-term threshold of the academic calendar, the Principal Administrator addressed the unified student body during the ceremonial Monday morning assembly.\n\nThe address reaffirmed the core institutional pillars: Academic Excellence, Moral Probity, and Leadership With Empathy. Emphasis was placed on punctuality, active participation in co-curricular societies, and strict adherence to the school honor code during continuous assessment drills.\n\n"Every scholar at Stanbax is an ambassador of noble heritage," the Principal reiterated. "True brilliance shines brightest when accompanied by character, courtesy, and compassion."\n\nParents and guardians are encouraged to review the weekly continuous assessment summaries uploaded to the Parent Portal and maintain open communication with assigned class form tutors.`,
    category: 'Executive Bulletin',
    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2026-09-05T07:30:00.000Z',
    readTime: '3 min read',
    author: {
      id: 'admin-1',
      name: 'Principal Administrator',
      role: 'Principal Administrator',
      gradeOrTitle: 'School Administration & Registry'
    },
    tags: ['Principal Address', 'Discipline', 'Executive Bulletin', 'Term Calendar'],
    isFeatured: false,
    likesCount: 165,
    viewsCount: 920
  }
];
