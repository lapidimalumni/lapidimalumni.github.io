# GitHub Repository Secrets Setup Guide

GitHub Secrets are encrypted environment variables that are injected into the GitHub Actions build workflow. They're needed so the production build has the correct Supabase and Turnstile configuration.

## What You Need

Before starting, make sure you have these values ready from the other setup guides:

| Secret Name | Where to get it | Example value |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase dashboard → Settings → API → Project URL | `https://dupporsigycwuwdlvqhw.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase dashboard → Settings → API Keys → Publishable key | `sb_publishable__TrlhAXNim4...` |
| `VITE_SITE_DOMAIN` | The domain the site is served from | `lapidim-alumni.org` |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare dashboard → Turnstile → your site → Site Key | `0x4AAAAAAAxxxxxxxx` |

## Step-by-Step

### 1. Navigate to Repository Settings

1. Go to your GitHub repository: `https://github.com/YOUR_ORG/lapidimalumni-code`
2. Click the **Settings** tab (you need admin/owner access)
3. In the left sidebar, expand **Secrets and variables**
4. Click **Actions**

### 2. Add Each Secret

For each secret listed above, repeat these steps:

1. Click **New repository secret**
2. In the **Name** field, enter the secret name exactly (e.g., `VITE_SUPABASE_URL`)
3. In the **Secret** field, paste the value
4. Click **Add secret**

### 3. Add `VITE_SUPABASE_URL`

- **Name**: `VITE_SUPABASE_URL`
- **Value**: Your Supabase project URL

Where to find it:
1. Go to [Supabase dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (looks like `https://xxxxxxxx.supabase.co`)

### 4. Add `VITE_SUPABASE_PUBLISHABLE_KEY`

- **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value**: Your Supabase publishable key

Where to find it:
1. Go to **Settings** → **API Keys**
2. Stay on the **"Publishable and secret API keys"** tab (not the legacy tab)
3. Under **Publishable key**, copy the key labeled `default`
4. It starts with `sb_publishable_`

> **Note**: This is the PUBLIC key — it's safe to use in the frontend. Do NOT use the secret key here.

### 5. Add `VITE_SITE_DOMAIN`

- **Name**: `VITE_SITE_DOMAIN`
- **Value**: the domain the site is served from, without `https://`

For this project that is the custom domain, `lapidim-alumni.org` — not the
`lapidimalumni.github.io` address it is published from. To check, go to the
repo **Settings** → **Pages**; a custom domain is shown in the Custom domain
box, and the site address appears under "Your site is live at...".

> Keep this in step with the `SITE_DOMAIN` secret in Supabase, which is what
> the login emails are actually built from. See `docs/setup-supabase.md`.

### 6. Add `VITE_TURNSTILE_SITE_KEY`

- **Name**: `VITE_TURNSTILE_SITE_KEY`
- **Value**: Your Cloudflare Turnstile Site Key

Where to find it:
1. Go to [Cloudflare dashboard](https://dash.cloudflare.com)
2. Click **Turnstile** in the sidebar
3. Click on your site (`Lapidim Alumni`)
4. Copy the **Site Key** (starts with `0x4...`)

### 7. Verify All Secrets Are Added

After adding all 4 secrets, your Actions secrets page should look like this:

```
VITE_SUPABASE_URL              Updated just now
VITE_SUPABASE_PUBLISHABLE_KEY  Updated just now
VITE_SITE_DOMAIN               Updated just now
VITE_TURNSTILE_SITE_KEY        Updated just now
```

You can see the secret names but NOT their values (they're encrypted).

## How Secrets Are Used

The `deploy.yml` workflow passes these secrets as environment variables during the build step:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
    VITE_SITE_DOMAIN: ${{ secrets.VITE_SITE_DOMAIN }}
    VITE_TURNSTILE_SITE_KEY: ${{ secrets.VITE_TURNSTILE_SITE_KEY }}
```

Vite embeds `VITE_*` variables at build time, so the production bundle uses these values.

## Triggering a Rebuild

After adding secrets, you need to trigger a new build for them to take effect:

### Option A: Push a commit
Any push to the `main` branch triggers a build.

### Option B: Manual trigger
1. Go to your repo → **Actions** tab
2. Click on **Deploy to GitHub Pages** in the left sidebar
3. Click **Run workflow** → **Run workflow**

## Verifying the Deployment

1. After the build completes (check the **Actions** tab), go to your GitHub Pages URL
2. Open browser DevTools → Console
3. There should be no errors about missing Supabase URL or API key
4. Try the login flow — it should call the Supabase Edge Functions

## Troubleshooting

### Build passes but site doesn't connect to Supabase
- Check that you spelled the secret names exactly right (they're case-sensitive)
- The secrets must start with `VITE_` for Vite to include them
- Trigger a new build after adding/updating secrets

### "Invalid URL" or "fetch failed" in the console
- Check `VITE_SUPABASE_URL` doesn't have a trailing slash
- Make sure it includes the `https://` prefix
- Verify the URL is correct by opening it in a browser — it should show a JSON response

### Secrets not updating
- GitHub caches builds. After updating secrets, manually trigger a new build
- Clear your browser cache or hard-refresh the deployed site (Ctrl+Shift+R)

### "Permission denied" when adding secrets
- You need **Admin** or **Owner** access to the repository
- If you're a collaborator, ask the repo owner to add the secrets
