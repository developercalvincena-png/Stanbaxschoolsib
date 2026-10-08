import { GalleryPhoto } from '../types';

export const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-facility-1',
    title: 'Advanced Science & Chemistry Laboratories',
    category: 'facilities',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    caption: 'State-of-the-art STEM workstations equipped with precision optical microscopes, fume extractors, digital data probes, and safety gear for WAEC and Cambridge practicals.',
    date: '2025/2026 Academic Session',
    location: 'Science Quadrangle, Block B',
    featured: true,
    uploadedBy: 'School Administrator',
    uploadedAt: '2026-01-10'
  },
  {
    id: 'photo-sports-1',
    title: 'Stanbax Olympic Sports Arena & AstroTurf Pitch',
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    caption: 'Our floodlit FIFA-standard AstroTurf football pitch and IAAF tartan track hosting weekly physical education drills, inter-house matches, and athletics meets.',
    date: 'Inter-House Season 2026',
    location: 'Stanbax Sports Complex',
    featured: true,
    uploadedBy: 'Sports Director',
    uploadedAt: '2026-01-15'
  },
  {
    id: 'photo-event-1',
    title: 'Annual Inter-House Sports Fiesta & Relay Heat',
    category: 'events',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    caption: 'Scholars exhibiting speed, stamina, and team camaraderie during the high-energy 4x100m relay finals and grand parade before cheering parents.',
    date: 'February 2026',
    location: 'Main Athletics Stadium',
    featured: true,
    uploadedBy: 'School Administrator',
    uploadedAt: '2026-02-18'
  },
  {
    id: 'photo-facility-2',
    title: 'Digital ICT & Robotics Innovation Hub',
    category: 'facilities',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ultra-modern computing laboratory outfitted with high-speed fiber internet, Arduino microcontrollers, Raspberry Pi kits, and 3D prototyping tools.',
    date: '2025/2026 Academic Session',
    location: 'Technology Wing, 2nd Floor',
    featured: true,
    uploadedBy: 'ICT Lead',
    uploadedAt: '2026-01-08'
  },
  {
    id: 'photo-facility-3',
    title: 'Central Library & Research Study Commons',
    category: 'facilities',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    caption: 'Quiet academic haven stocking over 15,000 physical volumes, digital academic journals, JSTOR research access, and individual study carrels for senior exam prep.',
    date: '2025/2026 Academic Session',
    location: 'Memorial Academic Center',
    featured: true,
    uploadedBy: 'Chief Librarian',
    uploadedAt: '2026-01-12'
  },
  {
    id: 'photo-event-2',
    title: 'Annual Cultural Day & Nigerian Heritage Festival',
    category: 'events',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    caption: 'A vibrant celebration of Nigerian cultural heritage featuring traditional royal attire, Yoruba talking drums, Igbo masquerade displays, and cultural cuisine.',
    date: 'December 2025',
    location: 'Stanbax Grand Amphitheatre',
    featured: true,
    uploadedBy: 'School Administrator',
    uploadedAt: '2025-12-14'
  },
  {
    id: 'photo-facility-4',
    title: 'Early Childhood Montessori Play & Learning Studio',
    category: 'facilities',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80',
    caption: 'A colorful, child-safe haven for our Crèche and Nursery pupils, equipped with kinetic sand stations, tactile wooden manipulatives, and cozy phonics nooks.',
    date: '2025/2026 Academic Session',
    location: 'Early Years Pavilion',
    featured: false,
    uploadedBy: 'Early Years Coordinator',
    uploadedAt: '2026-01-20'
  },
  {
    id: 'photo-event-3',
    title: 'Speech, Prize-Giving & Valedictory Gala',
    category: 'events',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    caption: 'Honouring our graduating SSS 3 class with academic distinction plaques, leadership awards, and global university scholarship announcements.',
    date: 'July 2025',
    location: 'Grace Multipurpose Auditorium',
    featured: true,
    uploadedBy: 'School Administrator',
    uploadedAt: '2025-07-28'
  },
  {
    id: 'photo-arts-1',
    title: 'Music Conservatory & Performing Arts Hall',
    category: 'arts',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Acoustically engineered auditorium equipped with grand pianos, orchestral violins, saxophones, brass trumpets, and multi-track audio recording equipment.',
    date: '2025/2026 Academic Session',
    location: 'Fine Arts Pavilion',
    featured: false,
    uploadedBy: 'Music Director',
    uploadedAt: '2026-01-22'
  },
  {
    id: 'photo-sports-2',
    title: 'Aquatic Center & Swimming Training Facility',
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
    caption: 'Half-Olympic swimming pool with lane dividers, certified life-safety supervisors, and year-round swimming coaching for both primary and secondary pupils.',
    date: '2025/2026 Academic Session',
    location: 'Aquatics Complex',
    featured: false,
    uploadedBy: 'Sports Director',
    uploadedAt: '2026-01-18'
  },
  {
    id: 'photo-academic-1',
    title: 'Mathematics & STEM Olympiad Masterclass',
    category: 'academics',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80',
    caption: 'Senior scholars working through advanced Olympiad problem sets, Cambridge past papers, and collaborative peer-tutoring seminars.',
    date: 'Term 2, 2026',
    location: 'Honours Hall, Block A',
    featured: false,
    uploadedBy: 'Mathematics HOD',
    uploadedAt: '2026-02-05'
  },
  {
    id: 'photo-facility-5',
    title: 'Modern Boarding Hall & Nutrition Dining Center',
    category: 'facilities',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    caption: 'Spacious, air-conditioned dining facility serving nutritionally balanced, chef-prepared hot meals three times daily for residential boarding students.',
    date: '2025/2026 Academic Session',
    location: 'Residential Hostel Precinct',
    featured: false,
    uploadedBy: 'Boarding Superintendent',
    uploadedAt: '2026-01-25'
  }
];
