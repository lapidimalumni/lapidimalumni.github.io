# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account)
2. Click **New Project**
3. Fill in:
   - **Name**: `lapidim-alumni`
   - **Database Password**: Generate a strong password and save it somewhere safe
   - **Region**: Choose the closest to your users (e.g., `West EU (Ireland)` for Israel)
4. Click **Create new project** and wait ~2 minutes for it to provision

## 2. Get Your Project Credentials

1. Go to **Settings** → **API Keys** (in the left sidebar)
2. You'll see two tabs — stay on **"Publishable and secret API keys"** (the default, new tab)
3. Copy these values — you'll need them later:

| Value | Where to find it | Used for |
|---|---|---|
| **Project URL** | Settings → API → Project URL | `VITE_SUPABASE_URL` in `.env` and GitHub secrets |
| **Publishable key** | Under "Publishable key" → `default` | `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` and GitHub secrets |
| **Secret key** | Under "Secret keys" → `default` (click eye icon to reveal) | Edge Function secret (NEVER expose to frontend) |

The publishable key starts with `sb_publishable_` and is safe to use in browser code.
The secret key starts with `sb_secret_` and **must only be used server-side** (in Edge Functions).

> **IMPORTANT**: The secret key bypasses Row Level Security. Never put it in frontend code or `.env` files. It goes only in Edge Function secrets.

> **Note**: Do NOT use the "Legacy anon, service_role API keys" tab. Those keys are deprecated.

## 3. Run the Database Schema

1. Go to **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` from this project and copy its entire contents
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" — this means all tables were created

### Verify the tables were created

1. Go to **Table Editor** in the left sidebar
2. You should see 4 tables: `alumni`, `magic_links`, `sessions`, `contact_submissions`
3. Each table should show a lock icon (RLS enabled)

## 4. Seed Your First Admin User

1. Go back to **SQL Editor** → **New query**
2. Run this SQL (replace with your actual details):

```sql
INSERT INTO alumni (email, full_name_en, full_name_he, cohort_start, cohort_end, role, certificate_id)
VALUES (
  'your.actual.email@gmail.com',
  'Your Name',
  'השם שלך',
  2020,
  2024,
  'admin',
  'LAPD-ALMN-20250101-0001'
);
```

3. Click **Run**
4. Go to **Table Editor** → **alumni** to verify your user appears

## 5. Install the Supabase CLI

You need the CLI to deploy Edge Functions.

### Option A: Using npm (recommended)
```bash
npm install -g supabase
```

### Option B: Using scoop (Windows)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Option C: Direct download
Go to [https://github.com/supabase/cli/releases](https://github.com/supabase/cli/releases) and download the latest release for your OS.

### Verify installation
```bash
supabase --version
```

## 6. Link Your Project

1. Log in to the CLI:
```bash
supabase login
```
This opens a browser window — authorize the CLI.

2. Link to your project:
```bash
cd /path/to/lapidim-alumni-code
supabase link --project-ref YOUR_PROJECT_REF
```

Your **project ref** is the subdomain of your Supabase URL. For example, if your URL is `https://dupporsigycwuwdlvqhw.supabase.co`, the project ref is `dupporsigycwuwdlvqhw`.

## 7. Set Edge Function Secrets

These secrets are available to all your Edge Functions at runtime:

```bash
supabase secrets set SB_SECRET_KEY=sb_secret_your-secret-key-here
supabase secrets set GMAIL_USER=lapidim.alumni@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=your-16-char-app-password
supabase secrets set TURNSTILE_SECRET_KEY=your-turnstile-secret-key-here
supabase secrets set SITE_DOMAIN=your-github-pages-domain.github.io
```

The `SB_SECRET_KEY` is the **Secret key** from step 2 (starts with `sb_secret_`). We use `SB_SECRET_KEY` instead of `SUPABASE_SECRET_KEY` because Supabase reserves the `SUPABASE_` prefix for internal use.

Replace the other values with your actual keys (see the Gmail and Cloudflare setup guides for how to get those).

> **Note**: `SUPABASE_URL` is automatically available in Edge Functions — you don't need to set it manually.

## 8. Deploy Edge Functions

From the project root:

```bash
supabase functions deploy send-magic-link
supabase functions deploy verify-magic-link
supabase functions deploy get-session
supabase functions deploy logout
supabase functions deploy contact-form
supabase functions deploy admin
supabase functions deploy verify-certificate
```

Or deploy all at once:

```bash
supabase functions deploy
```

### Verify deployment

1. Go to your Supabase dashboard → **Edge Functions** in the left sidebar
2. You should see all 7 functions listed with "Active" status

## 9. Update Your .env File

Open `.env` in the project root and fill in your values:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-publishable-key-here
VITE_SITE_DOMAIN=your-github-pages-domain.github.io
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key-here
```

## Troubleshooting

### "relation does not exist" errors
You haven't run the schema SQL yet. Go to SQL Editor and run `supabase/schema.sql`.

### Edge Functions return CORS errors
The functions include CORS headers. Make sure you deployed them after the latest code changes. Re-run `supabase functions deploy`.

### "Invalid API key" errors
Double-check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` match what's in your Supabase dashboard under Settings → API Keys.

### Edge Functions can't access the database
Make sure you set the `SUPABASE_SECRET_KEY` secret via `supabase secrets set`. The secret key (starts with `sb_secret_`) is different from the publishable key.
