# Stanbax Schools — Free Hosting & Zero-Database Setup Guide
*(100% Free Hosting on Vercel or GitHub Pages)*

This application is engineered with an **Embedded Resilient Data Architecture**, meaning:
- **Zero External Database Servers Needed**: You will **never** experience database connection timeouts, sleep modes, dropped connections, or missing SQL migrations.
- **Pre-Loaded Nigerian Curriculum**: All student records, classes, tutors, lesson notes, grading scales, admissions, and landing page content are pre-seeded and fully functional out-of-the-box.
- **Client-Side Persistence**: Any change made in the Admin, Tutor, or Student portal is safely stored in the browser's persistent storage.
- **One-Click Backup & Restore**: Download your complete database as a portable `.json` file from **Admin Portal → School Settings → Institutional Database Shield** anytime to back up or migrate across devices.

---

## Option 1: Deploy on Vercel (Recommended — 2 Minutes, 100% Free)

Vercel provides free SSL, fast global CDN, and automatic deployment whenever you push to GitHub.

### Step-by-Step:
1. **Push your project to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Stanbax Schools"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
   git push -u origin main
   ```
2. **Log into [vercel.com](https://vercel.com)** (sign up free with your GitHub account).
3. Click **"Add New..." → "Project"**.
4. Select your `stanbax` GitHub repository and click **Import**.
5. Vercel will auto-detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` *(Pre-configured)*
   - **Output Directory**: `dist` *(Pre-configured)*
6. *(Optional)* Under **Environment Variables**, if you want to use the Gemini AI API for live online exam synthesis:
   - Name: `GEMINI_API_KEY`
   - Value: `<Your Google Gemini API Key>`
   *(Note: Even without an API key, the built-in Academic Curriculum Engine synthesizes complete 50-objective + 6-theory exams with zero errors!)*
7. Click **Deploy**.
8. In ~45 seconds, your site is live with a free `https://your-school.vercel.app` URL and free SSL!

---

## Option 2: Deploy on GitHub Pages (100% Free)

A GitHub Actions workflow is already included at `.github/workflows/deploy.yml`.

### Step-by-Step:
1. **Push your project to your GitHub repository** (same as above).
2. Go to your repository on GitHub.
3. Click **Settings** (top tab) → **Pages** (left sidebar under "Code and automation").
4. Under **"Build and deployment" → "Source"**, change the dropdown from *Deploy from a branch* to **GitHub Actions**.
5. Go to the **Actions** tab on your repository: you will see the `Deploy to GitHub Pages` workflow running automatically.
6. Once complete (~1 minute), your school website is live at:
   `https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY>/`

---

## Why You Will Never Experience "Database Issues"

| Typical School Website Problem | How Stanbax Schools Solves It |
|---|---|
| **SQL Database Sleep / Timeout** | We do not depend on fragile free-tier SQL/Postgres servers that sleep after 7 days of inactivity. |
| **Missing Connection Strings** | The database engine is embedded directly in the application — zero configuration needed. |
| **Data Loss on Device Switch** | Go to **Admin Portal → School Settings → Institutional Database Shield**, click **"Export Database (.json)"**, and restore it on any new device or computer with 1 click. |
| **Offline Exam Generator** | If the AI server is not reachable on static hosting, the system seamlessly switches to the internal WAEC/BECE syllabus engine. |

---

## Technical Summary of Included Hosting Files

- `vercel.json`: Handles client-side SPA routing, deep link refreshes, and CDN caching headers.
- `vite.config.ts`: Configured with relative base `./` so assets load seamlessly whether on root domain or GitHub Pages subfolder.
- `.github/workflows/deploy.yml`: Fully automated CI/CD pipeline for GitHub Pages.
- `src/utils/curriculumEngine.ts`: Client-side fallback engine guaranteeing exam synthesis on static hosts without a Node.js backend.
