import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { getServiceClient } from '../_shared/supabase.ts'
import { sendEmail } from '../_shared/email.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { email } = await req.json()
    if (!email) {
      return new Response(
        JSON.stringify({ data: { message: 'If this email is registered, a login link has been sent.' } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getServiceClient()

    // Gmail-aware match: canonical_email() strips dots and +tags for gmail.com,
    // so any spelling of a stored Gmail address finds the row. The link is
    // sent to the stored email.
    const { data: canon } = await supabase.rpc('canonical_email', { addr: String(email) })
    const { data: alumni } = canon
      ? await supabase
          .from('alumni')
          .select('id, email, full_name_en')
          .eq('email_canon', canon)
          .maybeSingle()
      : { data: null }

    // Always return generic message (don't reveal if email exists)
    if (!alumni) {
      return new Response(
        JSON.stringify({ data: { message: 'If this email is registered, a login link has been sent.' } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate magic link token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    // Store magic link
    await supabase.from('magic_links').insert({
      alumni_id: alumni.id,
      token,
      expires_at: expiresAt,
      used: false,
    })

    // Send email via Gmail SMTP
    const siteDomain = Deno.env.get('SITE_DOMAIN') || 'localhost:5173'
    const loginUrl = `https://${siteDomain}/login?token=${token}`

    await sendEmail({
      to: alumni.email,
      subject: 'Your Lapidim Alumni Login Link',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Hello ${alumni.full_name_en},</h2>
          <p>Click the link below to log in to the Lapidim Alumni Network:</p>
          <p><a href="${loginUrl}" style="display: inline-block; background: #1e293b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Log In to Lapidim Alumni</a></p>
          <p style="color: #64748b; font-size: 14px;">This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">Lapidim Program Alumni Network &bull; Technion</p>
        </div>
      `,
    })

    return new Response(
      JSON.stringify({ data: { message: 'If this email is registered, a login link has been sent.' } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
