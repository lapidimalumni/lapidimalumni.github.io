import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { getServiceClient } from '../_shared/supabase.ts'
import { sendEmail } from '../_shared/email.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { name, email, message, turnstile_token } = await req.json()

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getServiceClient()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    // Check rate limit: count recent submissions from this IP
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', fiveMinutesAgo)

    const submissionCount = count || 0

    // If more than 2 submissions, require captcha
    if (submissionCount >= 2) {
      if (!turnstile_token) {
        return new Response(
          JSON.stringify({ data: { captcha_required: true } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify turnstile token
      const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY')
      if (turnstileSecret) {
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstile_token,
            remoteip: ip,
          }),
        })
        const verifyResult = await verifyResponse.json()

        if (!verifyResult.success) {
          return new Response(
            JSON.stringify({ error: 'Captcha verification failed' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Store submission
    await supabase.from('contact_submissions').insert({
      name,
      email,
      message,
      ip_address: ip,
    })

    // Send notification email to the alumni Gmail
    const gmailUser = Deno.env.get('GMAIL_USER')
    if (gmailUser) {
      await sendEmail({
        to: gmailUser,
        subject: `Contact Form: ${name}`,
        html: `
          <div style="font-family: sans-serif;">
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f1f5f9; padding: 12px; border-radius: 8px;">${message}</p>
          </div>
        `,
        replyTo: email,
      })
    }

    return new Response(
      JSON.stringify({ data: { message: 'Message sent successfully' } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
