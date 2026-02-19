# Lapidim Alumni Website

A bilingual (English/Hebrew) alumni website for the Lapidim Excellence Program at the Technion – Israel Institute of Technology.

## Features

- **Bilingual Support**: Full English and Hebrew with RTL layout
- **Magic Link Auth**: Passwordless login via email — no passwords stored
- **Members Area**: Protected section with events, certificate management, and community links
- **Certificate of Membership**: Public verification with non-enumerable IDs
- **LinkedIn Integration**: Add certificates directly to LinkedIn profiles
- **Contact Form**: With progressive captcha
- **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Routing**: React Router v6 (BrowserRouter + SPA redirect for GitHub Pages)
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
src/
├── components/
│   ├── layout/         # Header, Footer
│   ├── ui/             # Reusable UI components
│   └── features/       # Feature-specific components
├── contexts/           # Auth context
├── data/               # Translations (EN/HE), events
├── hooks/              # Custom React hooks
├── lib/                # Supabase client, API wrappers
├── pages/              # Page components
├── types/              # TypeScript types
└── utils/              # Utility functions

docs/                   # Setup guides
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (see `docs/setup-supabase.md`)

### Setup

Follow the guides in `docs/` in this order:

1. `docs/setup-supabase.md` — Create the database and configure secrets
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
| `VITE_SITE_DOMAIN` | Your GitHub Pages domain |

## Deployment

Push to `main` — GitHub Actions builds and deploys to GitHub Pages automatically.

The SPA redirect is handled by `public/404.html` + `index.html` so clean URLs work on GitHub Pages.

## Certificate Verification

Alumni certificates can be verified publicly at:
```
/verify/{certificate-id}
```
