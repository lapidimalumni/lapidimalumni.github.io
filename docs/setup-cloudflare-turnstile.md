# Cloudflare Turnstile Setup Guide

Cloudflare Turnstile is a privacy-friendly CAPTCHA alternative used on the contact form to prevent spam. It appears automatically after 2 form submissions from the same IP.

## 1. Create a Cloudflare Account (if you don't have one)

1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Create a free account
3. You do NOT need to add or transfer a domain — Turnstile works independently

## 2. Add a Turnstile Widget

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com)
2. In the left sidebar, click **Turnstile**
3. Click **Add site** (or **Get started** if it's your first time)
4. Fill in the form:

| Field | Value |
|---|---|
| **Site name** | `Lapidim Alumni` (any name — just for your reference) |
| **Domain** | Your GitHub Pages domain, e.g., `lapidim-alumni.github.io` |
| **Widget mode** | **Managed** (recommended — auto-decides between invisible and visible challenge) |

> **Tip**: For local development, also add `localhost` as a domain so Turnstile works on `localhost:5173`.

5. Click **Create**

## 3. Copy Your Keys

After creation, you'll see two keys:

| Key | What it looks like | Where it goes |
|---|---|---|
| **Site Key** | `0x4AAAA...` (public) | `.env` as `VITE_TURNSTILE_SITE_KEY` and GitHub repo secret |
| **Secret Key** | `0x4AAAA...` (private) | Supabase Edge Function secret |

**Copy both keys now.** You can always find them again by going to Turnstile → clicking on your site.

## 4. Add the Site Key to Your Project

### For local development

Open `.env` in the project root and set:

```
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxxxx
```

### For production (GitHub Pages)

Add it as a GitHub repository secret — see the [GitHub Secrets setup guide](./setup-github-secrets.md).

## 5. Add the Secret Key to Supabase

This key is used server-side to verify the captcha response:

```bash
supabase secrets set TURNSTILE_SECRET_KEY=0x4AAAAAAAxxxxxxxxxxxxxxxx
```

## 6. Test the Integration

1. Start your dev server: `npm run dev`
2. Go to the home page and scroll to the contact form
3. Submit the form twice with valid data
4. On the 3rd submission attempt, the Turnstile widget should appear
5. Complete the challenge (it may be invisible/automatic in Managed mode)
6. Submit the form — it should succeed

## How It Works in the App

The contact form uses a progressive captcha approach:

1. **First 2 submissions** from any IP address: No captcha required
2. **3rd+ submission** within 5 minutes: Turnstile widget appears, user must complete it
3. The Edge Function verifies the token server-side before accepting the submission

This provides a smooth experience for legitimate users while blocking bots and spam.

## Widget Modes Explained

| Mode | Behavior |
|---|---|
| **Managed** (recommended) | Cloudflare decides — usually invisible, shows a challenge only if suspicious |
| **Non-interactive** | Always invisible — no user interaction needed |
| **Invisible** | Similar to non-interactive but with slight differences in implementation |

We recommend **Managed** as it provides the best balance of security and user experience.

## Testing Keys (for development only)

Cloudflare provides test keys that always pass or always fail:

| Purpose | Site Key | Secret Key |
|---|---|---|
| Always passes | `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` |
| Always blocks | `2x00000000000000000000AB` | `2x0000000000000000000000000000000AB` |
| Forces interactive | `3x00000000000000000000FF` | `3x0000000000000000000000000000000FF` |

You can use the "always passes" keys for development to avoid solving challenges.

## Troubleshooting

### Turnstile widget doesn't appear
- Check that `VITE_TURNSTILE_SITE_KEY` is set in `.env`
- Check the browser console for errors
- Make sure `localhost` is in the allowed domains for your Turnstile widget

### "Captcha verification failed" error
- The token may have expired (tokens are valid for ~5 minutes)
- The secret key might be wrong — verify it in the Cloudflare dashboard
- Re-set the secret: `supabase secrets set TURNSTILE_SECRET_KEY=your-key`

### Widget shows on the wrong domain
- Go to Cloudflare dashboard → Turnstile → your site → **Settings**
- Add all domains where the widget should work (e.g., `localhost`, `lapidim-alumni.github.io`)

### Want to disable Turnstile entirely
If you don't want captcha protection, simply leave `VITE_TURNSTILE_SITE_KEY` empty in `.env`. The `TurnstileWidget` component checks for this and renders nothing if the key is missing. The Edge Function will still work — it just won't require captcha verification.
