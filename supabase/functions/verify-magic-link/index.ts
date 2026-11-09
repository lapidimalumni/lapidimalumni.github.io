import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { getServiceClient } from '../_shared/supabase.ts'

const COMMUNITY_LINKS = {
  whatsapp: 'https://chat.whatsapp.com/YOUR_INVITE_CODE',
  facebook: 'https://www.facebook.com/groups/YOUR_GROUP_ID',
}

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { token } = await req.json()
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getServiceClient()

    // Find the magic link
    const { data: magicLink } = await supabase
      .from('magic_links')
      .select('id, alumni_id, expires_at, used')
      .eq('token', token)
      .single()

    if (!magicLink) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired link' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if used or expired
    if (magicLink.used || new Date(magicLink.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'This link has expired or has already been used' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark as used
    await supabase
      .from('magic_links')
      .update({ used: true })
      .eq('id', magicLink.id)

    // Get alumni data
    const { data: alumni } = await supabase
      .from('alumni')
      .select('*')
      .eq('id', magicLink.alumni_id)
      .single()

    if (!alumni) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create session
    const sessionToken = crypto.randomUUID()
    await supabase.from('sessions').insert({
      alumni_id: alumni.id,
      token: sessionToken,
    })

    // Update last login
    await supabase
      .from('alumni')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', alumni.id)

    return new Response(
      JSON.stringify({
        data: {
          session_token: sessionToken,
          community_links: COMMUNITY_LINKS,
          user: {
            id: alumni.id,
            email: alumni.email,
            full_name_en: alumni.full_name_en,
            full_name_he: alumni.full_name_he,
            cohort_start: alumni.cohort_start,
            cohort_end: alumni.cohort_end,
            role: alumni.role,
            certificate_id: alumni.certificate_id,
            linkedin_url: alumni.linkedin_url,
            created_at: alumni.created_at,
            last_login_at: new Date().toISOString(),
            email_updates: alumni.email_updates || false,
          },
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
