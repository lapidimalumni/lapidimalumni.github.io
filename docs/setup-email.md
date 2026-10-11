# Custom email addresses (@lapidim-alumni.org)

Addresses such as `tal@lapidim-alumni.org` are plain forwards handled by
Cloudflare Email Routing (free). The DNS for `lapidim-alumni.org` is on
Cloudflare, so the MX and SPF records were added with one click. The website
itself (GitHub Pages) is not involved.

## Current addresses

| Address | Forwards to |
|---|---|
| tal@lapidim-alumni.org | taltaltal1994@gmail.com |
| lior@lapidim-alumni.org | liorgrauer@gmail.com |
| tom@lapidim-alumni.org | tomrahav500@gmail.com |
| ohad@lapidim-alumni.org | ohadsharonwork@gmail.com |
| nitai@lapidim-alumni.org | nitai.kluger@gmail.com |

The catch-all rule is disabled, so mail to any other address bounces.

## Add or change an address

1. Cloudflare dashboard → Compute → Email Service → **Email Routing**, or the
   domain's **Email** section.
2. **Routing rules** → **Create routing rule** → custom address and destination.
3. A new destination gets a verification email from Cloudflare. Forwarding to it
   only starts once its owner clicks the link (check spam). Status is visible
   under **Destination addresses**.
4. Test by emailing the new address from another account.

## Sending as the address (free, optional)

Email Routing only receives. Cloudflare's own Email Sending needs a paid plan.
The free route is Resend (free tier: 3,000 emails/month, 100/day):

1. Add `lapidim-alumni.org` (preferably the `send.` subdomain) under Resend →
   Domains.
2. Add the DKIM and SPF records Resend shows in Cloudflare → DNS, then click
   **Verify**. Do not replace the SPF record that Email Routing added; merge
   them if both would sit on the root domain.
3. Create an API key in Resend. It is the SMTP password, so keep it out of the
   repo.
4. Each person: Gmail → Settings → Accounts → **Send mail as** → Add another
   address. Use `smtp.resend.com`, port 465 (SSL), username `resend`, password
   the API key. Gmail's confirmation code arrives through the forward.
