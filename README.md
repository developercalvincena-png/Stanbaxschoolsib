<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/95d4a0f0-23c0-4b14-b6e5-cf82e25cc472

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Deploying to Netlify (Multi-Device Cloud Sync)

When hosted on Netlify, web applications run as a client-side frontend. By default, changes like registering new students, publishing exams, or grading are stored inside the browser's local cache (`localStorage`). To make all changes appear on **every browser, computer, and smartphone**:

### 1. Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the Supabase Dashboard, open **SQL Editor** → click **New query**.
3. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.

### 2. Add Environment Variables in Netlify
1. Go to your [Netlify Dashboard](https://app.netlify.com) → click your site.
2. Navigate to **Site configuration** (or Site settings) → **Environment variables**.
3. Add the following two variables (obtained from your Supabase Dashboard under **Project Settings → API**):
   - `VITE_SUPABASE_URL` = `https://<your-project-ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `<your-anon-public-key>`

### 3. Redeploy
1. In Netlify, go to **Deploys** → click **Trigger deploy** → **Deploy site** (or push a git commit).
2. All data (students, grades, attendance, fees) will now be synchronized across all devices in real time.
