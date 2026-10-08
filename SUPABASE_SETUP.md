# Supabase Setup & Security Architecture

The app reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or browser-stored configuration in the Admin Portal). Without them it runs in local-only mode with zero external network dependencies.

## 1. 100% Free Forever Architecture (Up to 150 Users)

The entire application runs at **$0 / month forever** for schools with up to 150 users:
- **Database (Supabase Free Tier)**: Includes **50,000 monthly active users** and **500 MB PostgreSQL database storage**. 150 students, teachers, and parents generate less than 10 MB total, using under 2% of the free quota.
- **Web Hosting (Netlify / Vercel / GitHub Pages)**: Static React single-page application with **100 GB free bandwidth per month**, fast global CDN, and automated SSL certificates.
- **Passwords & Password Resets**: Passwords are cryptographically hashed using **bcrypt** (`gen_salt('bf')`) and stored directly in Supabase PostgreSQL (`public.credentials`), not just in local storage.

## 2. Apply Database Schema in Supabase

1. Open [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** → click **New Query**.
3. Paste all of `supabase/schema.sql` → click **Run**.

### Hardened Database Components & Password RPCs:
- **`public.credentials`**: Hashed authentication credentials using bcrypt. Direct table access is blocked from anon and authenticated; all verification and resets occur through audited SECURITY DEFINER procedures.
- **`public.reset_password(identifier, new_password, security_answer)`**: Allows scholars, staff, and administrators to reset forgotten passwords from the login screen. Validates security questions where configured, updates `credentials`, and mirrors the update into `school_state`.
- **`public.admin_reset_user_password(identifier, new_password)`**: Enables administrators to reset any user's password directly into the Supabase database.
- **`public.change_password(identifier, old_password, new_password)`**: Enforces that authenticated users verify their current password when updating their own credentials.
- **`public.register_student_credential(identifier, password, ref_id, aliases)`**: Allows self-registering scholars to provision login credentials directly into Supabase without requiring administrative privilege.
- **`public.verify_login(identifier, password)`**: Cryptographic bcrypt password verification returning a 32-byte authenticated session token.
- **`public.school_state`**: State storage with **FORCED Row Level Security (RLS)** and role-based key validation.
- **`public.audit_logs`**: Tamper-evident trail logging login attempts, password resets, and policy events.

## 2. Environment Variables Configuration

Set environment variables in your deployment environment or `.env`:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public Anon key (`eyJ...`) — Safe for client bundle |

**Zero-Trust Rule**: The `service_role` secret key is NEVER exposed to the frontend, public environment variables, or client bundles.

## 3. Security & Access Control Enforcement

- **Granular Key Scoping**:
  - **Public (Anonymous)**: Hero slides, gallery, academic programs, calendar, FAQs, meal menu, etc.
  - **Admin / Proprietress**: Complete administrative authority over school configuration, credentials, staff assignments, academic broadsheets, bursary settings.
  - **Faculty / Tutors**: Classroom lesson notes, continuous assessments, CBT quizzes, class attendance, timetables, and homework assignments.
  - **Students**: CBT drill attempts, student articles, ephemeral statuses, and community chat.
  - **Parents**: Consultation requests, payment receipts, and ward inquiries.
- **Privilege Escalation Defense**: `create_credential` requires `public.is_admin()`. Unprivileged sessions attempting account creation or role escalation are blocked and logged.
- **Self-Only Password Protection**: `change_password` enforces that non-admin accounts can only change their own credentials and must supply the current password.
- **Offline / Graceful Fallback**: If Supabase is unconfigured or offline, the app operates gracefully with local storage fallbacks without unhandled promise rejections.
