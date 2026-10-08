# Stanbax Schools ("promptmaster") — Data-Layer Review

**Architecture note:** there is no real database. All data lives in React state in `src/context/SchoolContext.tsx`, seeded from `src/data/*.ts` and persisted per-key in `localStorage`. The review below treats that layer as "the database."

## Critical errors (will corrupt or lose data)

1. **Backup/restore is lossy — data silently dropped.**
   - `exportDatabaseSnapshot` exports 17 keys but `importDatabaseSnapshot` only restores 10. **Testimonials, directives, appointments, proprietress messages, applications, broadcast logs, homeworks and notices are exported but never re-imported** — restoring a backup silently erases them (`SchoolContext.tsx` ~3391–3483).
   - Never exported at all: lesson notes, CBT exams/attempts, timetables, sick-bay logs, **parents**, consultation requests, **fee payments**, library books, images, all landing-page CMS content, entrance-exam settings, admin/proprietress passwords, and the AI-exam vault (`stanbax_tutor_exams_vault`, written directly by `AiExamCreatorTab.tsx` bypassing the context).
   - This directly contradicts DEPLOYMENT.md's "zero data loss / one-click restore" claim.

2. **Grades are global, not per-student.** `GradeRecord` has no `studentId`; a single `grades` array (`stanbax_grades`) is shown as *every* student's report card (`StudentPortal.tsx` ~216). `updateGrade()` edits the shared record by subject and then writes the shared average onto one student (`SchoolContext.tsx` ~2076–2151). Entering a score for one scholar changes everyone's results. `StudentProfile.grades` exists in types but is never populated.

3. **Homework status is global too.** `Homework` has no `studentId`; `toggleHomeworkStatus` flips the one shared record for all students, and any status (`Submitted`, `Graded`) toggles back to `Pending`.

4. **Registering a student can crash.** `registerStudent` calls `.trim()` on optional fields `password`, `securityQuestion`, `securityAnswer` — `TypeError` when omitted (`SchoolContext.tsx` ~1921–1923).

5. **Wrong account shown after refresh.** Login writes `stanbax_student_id` / `stanbax_tutor_id` to sessionStorage but `activeStudentId`/`activeTutorId` initialize to `DEMO_STUDENT`/`DEMO_TUTOR` and never read it back — an authenticated student/tutor who reloads sees the demo account's data. (`activeParentId` *is* restored — inconsistent.)

6. **Promotion writes broken class names.** `startNewAcademicSession` → `getNextClass` returns `Senior Secondary (SSS 1)`, `Junior Secondary (JSS 1)` — neither exists in `classes`, so promoted students can't be matched for attendance/rankings. SSS 3 graduates get the literal grade `"Graduated / Alumni (Class Completed)"` but `isAlumni` is never set, so they pollute active lists and rankings. Term archives inject the shared global gradebook into *every* student's history with hardcoded attendance counts.

7. **Backdoor credentials everywhere.** `isAdminPasswordValid` accepts 6 passwords including `stanbax2025`/`admin2025`/`stanbax` even after the admin changes the password — password changes don't actually secure the account. Same pattern for proprietress/tutor/student/parent (`stanbax2025` is a master key). Default admin security question is `"What is your password"` with the password as the answer.

## Data inconsistencies in seed data

8. **Same student, two names.** `stu-1` / `STX/2023/042` is "Tiwa Adeleke" in `DEMO_STUDENTS` but "Justin Ifechukwu Ejionye" in sick-bay log `sb-101`, fee record `fee-rec-901` and consultation `req-001`.

9. **Three different class identifiers.** `classes` uses `cls-14` for "SSS 2 Science"; seeded attendance uses `sss-2-science`; the timetable uses `cls-sss2-sci`. Lookups only work through `className` fallbacks — `classId` joins are effectively broken everywhere.
   - Seeded attendance rows also use `stu-001…006` instead of `stu-1…6` (regNumber fallback masks it in summaries, but the tutor portal's prefill maps entries by `studentId` and fails), and `submittedByTutorId: 'tut-001'` / "Mr. Kehinde Adeleke" doesn't exist (the class teacher is `tut-1`, Mr. Ogunleye).

10. **Conflicting "current term" sources.** `schoolInfo.activeTerm` = "2nd Term (Lent Term)" and `assessmentConfig.activeTerm` = '2nd Term', while `termResumptionConfig.termName` = '1st Term' with start `2026-09-15` — and the calendar labels Sep 15, 2026 as 1st Term resumption. The session is labelled `2025/2026` everywhere yet Sep–Dec 2026 dates belong to 2026/2027. Attendance summaries, grade terms and the school info panel therefore disagree about what term it is.

11. **Lesson-note authors don't match tutors.** `authorId` ↔ `authorName` mismatches on all 4 notes: `tut-1`→"Dr. Funsho Alabi" (real: Mr. Ogunleye), `tut-2`→"Mr. Emmanuel Adeleke" (real: Mrs. Adeyemi), `tut-3`→"Mrs. Ngozi Ezenwa" (real: Dr. Obi), `tut-4`→doesn't exist. Timetable tutor names (Dr. Chidi Okafor, Mr. Babatunde Balogun, etc.) likewise match no tutor or faculty record.

12. **Parents don't match children.** `parent-3` "Dr. & Mrs. K. Eze" claims `stu-3` — who is Chidera **Okafor** (parents Okafor). Students stu-4…stu-8 have `parentName`/`parentPhone` but no `ParentProfile`, so those parents can never log in. The testimonial "Engr. Kenneth Eze, parent of Primary 4 scholar" also conflicts with application `app-1` (Somtochukwu Eze → JSS 1).

13. **Self-promotion + missing fields.** Every seeded SSS 2 student has `promotionStatus: 'Promoted'` and `promotedToGrade: 'SSS 2 Science'` — their own current class. No student has `classId`, `feeBalance`/`feeTotal`, blood group, etc.

14. **Fee math doesn't reconcile.** Seeded payments are ₦185,000 while SSS 2 Science tuition is ₦265,000/term. Worse, no student has `feeTotal`/`feeBalance`, so `recordFeePayment` computes `newBal = 0 − amount → 'Fully Paid'` — any payment marks a student fully paid.

15. **Grading display vs config mismatch.** CA weights are 10/10/10 + exam 70 (config), but `StudentPortal` re-displays them rescaled to the old 20/20/10/50 split, and `DEMO_GRADES`/`markingGuide` remarks don't follow `DEFAULT_GRADING_SYSTEM` remarks anyway.

16. **Subject registry inconsistent.** `applicableCategories` vs `applicableLevels` contradict each other (e.g. Mathematics: all categories, but levels = Senior Secondary only). Many subjects used in timetables/notes/library (Agricultural Science, Further Mathematics, French, Data Processing & Coding…) are missing from `subjects` entirely.

17. **Class-teacher data kept in two unsynced places.** `SchoolClass.classTeacherId` and `TutorProfile.assignedClasses` are maintained separately; updating one doesn't update the other (`assignClassTeacher` only writes the class side).

## Omissions / missing pieces

18. No `deleteStudent`, no parent CRUD (`parents` has no add/update/delete — new admissions can never get portal accounts), no homework delete, no way to reject a fee payment, no `notices` update, `inquiries` never persisted to localStorage at all (lost on refresh).
19. `getAllUserCredentials` (admin vault) omits all parent accounts.
20. Students are keyed by `grade` **name strings**, not `classId` — renaming/deleting a class orphans every student, timetable and attendance record referencing it (no referential integrity anywhere).
21. Fabricated data on load: any saved student lacking `house`/`clubs`/`academicHistory` gets "Sapphire House (Blue)", two default clubs, and a fake "SSS 1 Science, 2024/2025, avg 84.5" history — even a creche pupil. `registerStudent` also seeds invented term averages (82.5/80/82/83.5).
22. `resetDailyAttendanceCounter` overwrites every student's real `attendancePercent` with 100 and `attendanceDays` with 0.
23. Student portal fabricates values when data is missing (hardcoded `58/60 Days (96.7%)`, `88.6`, `90.1` averages).
24. CBT filter in `StudentCbtTab` (`targetClass.includes('SSS') || includes('JSS')`) effectively shows every exam to every student.
25. `.github/workflows/deploy.yml` runs `npm ci` but the project ships only `bun.lock` — no `package-lock.json` — so GitHub Pages deployment fails at install.

## Suggested fix order

1. Fix `importDatabaseSnapshot` to restore everything export writes, and extend the snapshot to all remaining collections.
2. Add `studentId` to `GradeRecord`/`Homework` (per-student records) or namespace the stores.
3. Restore `activeStudentId`/`activeTutorId` from sessionStorage.
4. Guard `.trim()` calls in `registerStudent`.
5. Reconcile the stu-1 name conflict, parent↔child links, class/tutor ID scheme (pick one: `cls-*`), and the term/session disagreement.
6. Remove backdoor passwords before this is anywhere near a real school.
