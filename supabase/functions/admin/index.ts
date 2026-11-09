import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { getServiceClient } from '../_shared/supabase.ts'

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const body = await req.json()
    const { session_token, action } = body

    if (!session_token || !action) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getServiceClient()

    // Validate session and admin role
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

    const { data: admin } = await supabase
      .from('alumni')
      .select('role')
      .eq('id', session.alumni_id)
      .single()

    if (!admin || admin.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle actions
    if (action === 'list-alumni') {
      const { data: alumni } = await supabase
        .from('alumni')
        .select('*')
        .order('created_at', { ascending: false })

      return new Response(
        JSON.stringify({ data: { alumni: alumni || [] } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'add-alumni') {
      const { alumni: newAlumni } = body
      if (!newAlumni?.email || !newAlumni?.full_name_en || !newAlumni?.full_name_he) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Auto-generate certificate ID
      const { data: certId } = await supabase.rpc('generate_certificate_id')

      const { data: created, error: insertError } = await supabase
        .from('alumni')
        .insert({
          email: String(newAlumni.email).trim().toLowerCase(),
          full_name_en: newAlumni.full_name_en,
          full_name_he: newAlumni.full_name_he,
          cohort_start: newAlumni.cohort_start,
          cohort_end: newAlumni.cohort_start,
          role: newAlumni.role || 'alumni',
          linkedin_url: newAlumni.linkedin_url || null,
          certificate_id: certId,
        })
        .select()
        .single()

      if (insertError) {
        return new Response(
          JSON.stringify({ error: insertError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ data: { alumni: created } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'remove-alumni') {
      const { email } = body
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Don't allow removing yourself
      const { data: selfCheck } = await supabase
        .from('alumni')
        .select('id')
        .eq('id', session.alumni_id)
        .eq('email', email.toLowerCase())
        .single()

      if (selfCheck) {
        return new Response(
          JSON.stringify({ error: 'Cannot remove yourself' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Delete sessions for this alumni first
      const { data: target } = await supabase
        .from('alumni')
        .select('id')
        .eq('email', email.toLowerCase())
        .single()

      if (!target) {
        return new Response(
          JSON.stringify({ error: 'Alumni not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Clean up related data
      await supabase.from('sessions').delete().eq('alumni_id', target.id)
      await supabase.from('magic_links').delete().eq('alumni_id', target.id)

      const { error: deleteError } = await supabase
        .from('alumni')
        .delete()
        .eq('email', email.toLowerCase())

      if (deleteError) {
        return new Response(
          JSON.stringify({ error: deleteError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ data: { message: 'Alumni removed' } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'stats') {
      const { count: total } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true })

      const { count: admins } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')

      const { count: everLoggedIn } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true })
        .not('last_login_at', 'is', null)

      return new Response(
        JSON.stringify({ data: { total: total || 0, admins: admins || 0, ever_logged_in: everLoggedIn || 0 } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'list-events') {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false })

      if (error) return json({ error: error.message }, 400)
      return json({ data: { events: events || [] } })
    }

    if (action === 'save-event') {
      const e = body.event
      const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
      const link = (v: unknown) => {
        const s = text(v)
        if (!s) return null
        return /^https?:\/\//i.test(s) ? s : undefined
      }

      const registration_link = link(e?.registration_link)
      const recap_link = link(e?.recap_link)
      const feedback_link = link(e?.feedback_link)
      const image = text(e?.image)

      if (!text(e?.title) || !text(e?.title_he) || !/^\d{4}-\d{2}-\d{2}$/.test(text(e?.event_date))) {
        return json({ error: 'Title (English and Hebrew) and a valid date are required' }, 400)
      }
      if (registration_link === undefined || recap_link === undefined || feedback_link === undefined) {
        return json({ error: 'Links must start with http:// or https://' }, 400)
      }
      if (image && !/^(https?:\/\/|\/)/i.test(image)) {
        return json({ error: 'Image must be a /path or an http(s) URL' }, 400)
      }

      const row = {
        title: text(e.title),
        title_he: text(e.title_he),
        description: text(e.description),
        description_he: text(e.description_he),
        event_date: text(e.event_date),
        time_text: text(e.time_text),
        location: text(e.location),
        location_he: text(e.location_he),
        image,
        registration_link,
        recap_link,
        feedback_link,
        published: e.published !== false,
        updated_at: new Date().toISOString(),
      }

      const query = e.id
        ? supabase.from('events').update(row).eq('id', e.id)
        : supabase.from('events').insert(row)
      const { data: saved, error } = await query.select().single()

      if (error) return json({ error: error.message }, 400)
      return json({ data: { event: saved } })
    }

    if (action === 'delete-event') {
      const { id } = body
      if (!id) return json({ error: 'Event id is required' }, 400)
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) return json({ error: error.message }, 400)
      return json({ data: { message: 'Event deleted' } })
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
