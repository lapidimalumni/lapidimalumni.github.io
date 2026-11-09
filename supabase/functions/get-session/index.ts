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
    const body = await req.json()
    const { session_token, action } = body

    if (!session_token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getServiceClient()

    // Find session
    const { data: session } = await supabase
      .from('sessions')
      .select('alumni_id')
      .eq('token', session_token)
      .single()

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle email updates toggle
    if (action === 'toggle-email-updates') {
      const { email_updates } = body
      await supabase
        .from('alumni')
        .update({ email_updates: !!email_updates })
        .eq('id', session.alumni_id)

      return new Response(
        JSON.stringify({ data: { email_updates: !!email_updates } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Events visible to members (unpublished ones stay admin-only)
    if (action === 'list-events') {
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('event_date', { ascending: true })

      return new Response(
        JSON.stringify({ data: { events: events || [] } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get alumni data
    const { data: alumni } = await supabase
      .from('alumni')
      .select('*')
      .eq('id', session.alumni_id)
      .single()

    if (!alumni) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        data: {
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
            last_login_at: alumni.last_login_at,
            email_updates: alumni.email_updates || false,
          },
          community_links: COMMUNITY_LINKS,
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
