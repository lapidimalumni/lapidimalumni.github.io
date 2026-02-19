# Lapidim Alumni Website

A bilingual (English/Hebrew) alumni website for the Lapidim Excellence Program at the Technion – Israel Institute of Technology.

## Features

- **Bilingual Support**: Full English and Hebrew with RTL layout
- **Magic Link Auth**: Passwordless login via email — no passwords stored
- **Members Area**: Protected section with events, certificate management, and community links
- **Admin Console**: Manage alumni, view stats, add/remove members
- **Certificate of Membership**: Public verification with random, non-enumerable IDs
- **LinkedIn Integration**: Add certificates directly to LinkedIn profiles
- **Contact Form**: With progressive Cloudflare Turnstile captcha
- **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Auth**: Custom magic link flow (Edge Functions + Gmail SMTP)
- **Captcha**: Cloudflare Turnstile
- **Routing**: React Router v6 (BrowserRouter + SPA redirect for GitHub Pages)
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
src/
├── components/
│   ├── layout/         # Header, Footer
│   ├── ui/             # Reusable UI components
│   └── features/       # TurnstileWidget, CertificateLink
├── contexts/           # AuthContext (session-based auth)
├── data/               # Translations (EN/HE), events
├── hooks/              # useAuth, useLanguage
├── lib/                # Supabase client, API wrappers
├── pages/              # Home, Login, Members, Admin, CertificateVerify, ...
├── types/              # User type
└── utils/              # Certificate helpers

supabase/
├── functions/          # 7 Edge Functions (Deno)
│   ├── _shared/        # cors, supabase client, email (Gmail SMTP)
│   ├── send-magic-link/
│   ├── verify-magic-link/
│   ├── get-session/
│   ├── logout/
│   ├── contact-form/
│   ├── admin/
│   └── verify-certificate/
├── schema.sql          # DB schema + seed
└── config.toml         # JWT verification disabled (auth is custom)

docs/
├── setup-supabase.md
├── setup-gmail.md
├── setup-cloudflare-turnstile.md
└── setup-github-secrets.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase CLI (`npm install -g supabase`)
- A Supabase project
- A Gmail account with an App Password
- A Cloudflare Turnstile site (optional — captcha is progressive)

### Setup

Follow the guides in `docs/` in this order:

1. `docs/setup-supabase.md` — Create the database, deploy Edge Functions, set secrets
2. `docs/setup-gmail.md` — Create a Gmail App Password for sending emails
3. `docs/setup-cloudflare-turnstile.md` — Set up the captcha widget
4. `docs/setup-github-secrets.md` — Add secrets to GitHub for CI/CD

### Local Development

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |

Supabase Edge Function secrets (set via `supabase secrets set`):

| Secret | Description |
|---|---|
| `SB_SECRET_KEY` | Supabase secret key |
| `GMAIL_USER` | Gmail address used for sending |
| `GMAIL_APP_PASSWORD` | Gmail App Password |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |
| `SITE_DOMAIN` | Your GitHub Pages domain |

## Deployment

Push to `main` — GitHub Actions builds and deploys to GitHub Pages automatically.

The SPA redirect is handled by `public/404.html` + `index.html` so clean URLs work on GitHub Pages.

## Certificate Verification

Certificates can be verified publicly at:
```
/verify/{certificate-id}
```

IDs have the format `LAPD-ALMN-XXXXXXXX` (8 random alphanumeric characters — non-sequential, non-enumerable).
