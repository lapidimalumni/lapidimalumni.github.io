# Gmail App Password Setup Guide

The app uses Gmail SMTP to send magic login links and contact form notifications. You'll need a Gmail account and an App Password.

## 1. Enable 2-Step Verification

App Passwords require 2-Step Verification to be enabled on your Google account.

1. Go to [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Under **"How you sign in to Google"**, click **2-Step Verification**
3. Follow the prompts to enable it (you'll need your phone for verification)

> **Note**: If you already have 2-Step Verification enabled, skip to step 2.

## 2. Create an App Password

1. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - If this link doesn't work, go to Google Account → Security → 2-Step Verification → scroll to the bottom → **App passwords**
2. In the **"App name"** field, type: `Lapidim Alumni`
3. Click **Create**
4. Google will show a **16-character password** (formatted as `xxxx xxxx xxxx xxxx`)
5. **Copy it immediately** — you won't be able to see it again

> **Important**: This is NOT your regular Gmail password. It's a separate password specifically for this app.

## 3. Add Secrets to Supabase

Run these commands (replace with your actual values):

```bash
supabase secrets set GMAIL_USER=lapidim.alumni@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

Replace `xxxx xxxx xxxx xxxx` with the 16-character App Password from step 2 (spaces are optional — you can include or remove them).

## 4. Test the Integration

1. Make sure you've seeded an admin user in the `alumni` table (see Supabase setup guide)
2. Deploy the Edge Functions: `supabase functions deploy`
3. Start your dev server: `npm run dev`
4. Go to the login page and enter the admin user's email
5. Check your inbox — you should receive a magic link email within a few seconds

## Gmail Sending Limits

Gmail allows:
- **500 emails/day** for regular Gmail accounts
- **2,000 emails/day** for Google Workspace accounts

This is more than enough for a small alumni network.

## Troubleshooting

### Emails not arriving
1. Check your spam/junk folder
2. Check Edge Function logs: Supabase dashboard → **Edge Functions** → click on `send-magic-link` → **Logs**
3. Make sure both `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set: `supabase secrets list`

### "Invalid login" or "Authentication failed" error
- Make sure you're using the **App Password**, not your regular Gmail password
- Make sure 2-Step Verification is still enabled on the account
- Try creating a new App Password if the old one doesn't work

### "App passwords" option not showing in Google account
- 2-Step Verification must be enabled first
- App Passwords are not available for accounts managed by an organization that has disabled them
- Try the direct link: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### Emails going to spam
- Gmail-to-Gmail emails rarely go to spam
- For non-Gmail recipients, the email will come from your Gmail address with proper SPF/DKIM (handled by Google automatically)
- Keep email content clean and avoid spam trigger words

### "Connection refused" or timeout errors in Edge Functions
- Supabase Edge Functions run on Deno Deploy, which supports outbound SMTP on port 465 (TLS)
- If SMTP is blocked, an alternative would be to use the Gmail API with OAuth2 instead — but App Password + SMTP should work
