import { LessonNote } from '../types';

// Sample base64 placeholder for downloadable PDF/DOCX/Images
const SAMPLE_PDF_BASE64 = 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNCAwIFIKPj4KPj4KL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzEyIFRkCihTdGFuYmF4IFNjaG9vbHMgLSBMZXNzb24gTm90ZSBBcmNoaXZlKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDIxOSAwMDAwMCBuIAowMDAwMDAwMjk2IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzg5CiUlRU9GCg==';

// Clean SVG-based data URL for diagram preview and download
const SAMPLE_DIAGRAM_IMAGE = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#0f172a" rx="16"/>
  <rect x="20" y="20" width="760" height="460" fill="#1e293b" rx="12" stroke="#334155" stroke-width="2"/>
  <text x="400" y="70" fill="#fbbf24" font-size="24" font-weight="bold" font-family="sans-serif" text-anchor="middle">STANBAX ACADEMIC DIAGRAM: HYDROCARBON SERIES</text>
  <text x="400" y="100" fill="#94a3b8" font-size="14" font-family="sans-serif" text-anchor="middle">Chemistry Department • SSS 3 Science Stream</text>
  
  <rect x="60" y="140" width="200" height="280" fill="#0f172a" rx="8" stroke="#3b82f6" stroke-width="2"/>
  <text x="160" y="175" fill="#60a5fa" font-size="18" font-weight="bold" font-family="sans-serif" text-anchor="middle">ALKANES (CnH2n+2)</text>
  <text x="160" y="210" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Saturated Hydrocarbons</text>
  <text x="160" y="240" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Single C-C covalent bond</text>
  <text x="160" y="270" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Methane (CH4)</text>
  <text x="160" y="300" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Ethane (C2H6)</text>
  <text x="160" y="330" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Propane (C3H8)</text>
  <rect x="80" y="365" width="160" height="35" rx="6" fill="#1d4ed8"/>
  <text x="160" y="388" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">Substitution Reactions</text>

  <rect x="300" y="140" width="200" height="280" fill="#0f172a" rx="8" stroke="#10b981" stroke-width="2"/>
  <text x="400" y="175" fill="#34d399" font-size="18" font-weight="bold" font-family="sans-serif" text-anchor="middle">ALKENES (CnH2n)</text>
  <text x="400" y="210" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Unsaturated Series</text>
  <text x="400" y="240" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Double C=C bond present</text>
  <text x="400" y="270" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Ethene (C2H4)</text>
  <text x="400" y="300" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Propene (C3H6)</text>
  <text x="400" y="330" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Decolorizes Bromine Water</text>
  <rect x="320" y="365" width="160" height="35" rx="6" fill="#047857"/>
  <text x="400" y="388" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">Addition Reactions</text>

  <rect x="540" y="140" width="200" height="280" fill="#0f172a" rx="8" stroke="#f59e0b" stroke-width="2"/>
  <text x="640" y="175" fill="#fbbf24" font-size="18" font-weight="bold" font-family="sans-serif" text-anchor="middle">ALKYNES (CnH2n-2)</text>
  <text x="640" y="210" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Highly Unsaturated</text>
  <text x="640" y="240" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Triple C≡C bond</text>
  <text x="640" y="270" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Ethyne / Acetylene (C2H2)</text>
  <text x="640" y="300" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Propyne (C3H4)</text>
  <text x="640" y="330" fill="#e2e8f0" font-size="13" font-family="sans-serif" text-anchor="middle">• Oxy-acetylene welding flame</text>
  <rect x="560" y="365" width="160" height="35" rx="6" fill="#b45309"/>
  <text x="640" y="388" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">Polymerization & Addition</text>
</svg>
`);

export const INITIAL_LESSON_NOTES: LessonNote[] = [
  {
    id: 'note-1',
    title: "Week 4: Newtonian Mechanics & Projectile Motion Calculations",
    subject: "Physics",
    targetClass: "Senior Secondary (SSS 3 Science)",
    term: "2nd Term (Lent Term)",
    session: "2025/2026 Academic Session",
    authorId: "tut-1",
    authorName: "Mr. Olumide Ogunleye",
    authorRole: "Senior Science Master & Class Teacher",
    datePublished: "2026-02-10",
    format: "pdf",
    content: `KEY OBJECTIVES:
1. Master parabolic projectile trajectory equations under constant gravity (g = 9.8 m/s²).
2. Compute Time of Flight: T = (2u sin θ) / g.
3. Determine Maximum Height reached: H_max = (u² sin² θ) / (2g).
4. Calculate Horizontal Range: R = (u² sin 2θ) / g. Note that maximum range occurs at θ = 45°.
5. Review WAEC practical calculations and friction mitigation.

LABORATORY CONNECTION:
Cross-reference your data with the ballistic pendulum measurements taken in Physics Lab 2 last Tuesday. Complete problem set 4.1 before Friday's tutorial session.`,
    attachment: {
      name: "Physics_SS3_Week4_Projectile_Motion.pdf",
      fileType: "pdf",
      fileSize: "1.4 MB",
      dataUrl: SAMPLE_PDF_BASE64
    },
    downloadsCount: 38
  },
  {
    id: 'note-2',
    title: "Week 5: Comprehensive Phonetics, Concord Rules & Formal Letter Structure",
    subject: "English Language",
    targetClass: "All Senior Secondary",
    term: "2nd Term (Lent Term)",
    session: "2025/2026 Academic Session",
    authorId: "tut-2",
    authorName: "Mrs. Folake Adeyemi",
    authorRole: "Head of Languages & JSS 1 Class Teacher",
    datePublished: "2026-02-14",
    format: "text",
    content: `STANBAX SCHOOLS - FACULTY OF LANGUAGES
MODULE 5: SUBJECT-VERB AGREEMENT (CONCORD) & ORAL DICTION

1. THE PRINCIPLE OF PROXIMITY
When subjects are connected by 'either...or' or 'neither...nor', the verb agrees with the closer subject:
• Neither the head prefect nor the tutors WERE present at the briefing.
• Neither the tutors nor the head prefect WAS present at the briefing.

2. COLLECTIVE NOUNS AS SINGLE UNITS
Nouns such as committee, audience, faculty, and jury take singular verbs when acting as a unified entity:
• The disciplinary committee has concluded its term review.
(Compare: The committee were divided in their opinions.)

3. EXPRESSIONS OF QUANTITY AND PAIR NOUNS
• A pair of scissors IS on the laboratory bench.
• My scissors ARE on the table.
• Ten kilometers IS a rigorous cross-country distance for junior runners.

4. WAEC ESSAY WRITING SPECIFICATION
• Formal Letter: Two addresses (sender at top right without punctuation inside lines, recipient at top left), official salutation ("Dear Sir," or "Dear Madam,"), capitalized centered heading underlined, structured body paragraphs, and complementary close ("Yours faithfully," followed by signature and full name).`,
    attachment: {
      name: "English_SS3_Concord_Rules_Lecture_Note.txt",
      fileType: "text",
      fileSize: "18 KB",
      textContent: `STANBAX SCHOOLS - FACULTY OF LANGUAGES
MODULE 5: SUBJECT-VERB AGREEMENT (CONCORD) & ORAL DICTION
... [Full lecture text included above]`
    },
    downloadsCount: 64
  },
  {
    id: 'note-3',
    title: "Week 6: Quadratic Equations, Complex Roots & Matrices Handout",
    subject: "Mathematics",
    targetClass: "Senior Secondary (SSS 2 & 3)",
    term: "2nd Term (Lent Term)",
    session: "2025/2026 Academic Session",
    authorId: "tut-1",
    authorName: "Mr. Olumide Ogunleye",
    authorRole: "Senior Science Master & Class Teacher",
    datePublished: "2026-02-18",
    format: "docx",
    content: `MATHEMATICS STUDY HANDOUT (WEEK 6)
TOPIC: QUADRATIC EQUATIONS BY COMPLETING THE SQUARE & MATRIX TRANSFORMATION

HIGHLIGHTS:
• General quadratic form: ax² + bx + c = 0 (where a ≠ 0).
• Discriminant analysis: Δ = b² - 4ac.
  - If Δ > 0: two distinct real roots.
  - If Δ = 0: two equal real roots (perfect square trinomial).
  - If Δ < 0: conjugate imaginary / complex roots.
• Matrix multiplication rule: Product AB is defined only when columns of A equal rows of B.
• Determinant of 2x2 matrix: det([a b; c d]) = ad - bc.

PRACTICE PROBLEMS:
Solve 3x² - 5x + 1 = 0 using the quadratic formula to 3 significant figures. Check solution with your class tutor.`,
    attachment: {
      name: "Mathematics_SS3_Quadratic_Equations_Handout.docx",
      fileType: "docx",
      fileSize: "820 KB",
      dataUrl: SAMPLE_PDF_BASE64
    },
    downloadsCount: 52
  },
  {
    id: 'note-4',
    title: "Week 3: Hydrocarbon Series, Functional Groups & Isomerism Infographic",
    subject: "Chemistry",
    targetClass: "Senior Secondary (SSS 3 Science)",
    term: "2nd Term (Lent Term)",
    session: "2025/2026 Academic Session",
    authorId: "tut-1",
    authorName: "Mr. Olumide Ogunleye",
    authorRole: "Senior Science Master & Class Teacher",
    datePublished: "2026-02-08",
    format: "image",
    content: `VISUAL REVISION GUIDE: ORGANIC CHEMISTRY FOUNDATIONS
Examine the accompanying high-resolution structural diagram highlighting:
1. Alkanes: sp3 hybridization, tetrahedral bond angle (109.5°), unreactive with electrophiles.
2. Alkenes: sp2 hybridization, planar geometry, rapid electrophilic addition across π-bond.
3. Alkynes: sp hybridization, linear geometry (180°), acidic terminal hydrogen detection with ammoniacal silver nitrate test.

EXAM PREPARATION:
Memorize the chemical test distinguishing ethene from ethyne for your 2nd CA test practical station.`,
    attachment: {
      name: "Chemistry_Hydrocarbons_Visual_Chart.png",
      fileType: "image",
      fileSize: "2.1 MB",
      dataUrl: SAMPLE_DIAGRAM_IMAGE
    },
    downloadsCount: 47
  }
];
