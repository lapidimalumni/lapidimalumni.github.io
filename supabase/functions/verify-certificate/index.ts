import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { getServiceClient } from '../_shared/supabase.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { cert_id } = await req.json()
    if (!cert_id) {
      return new Response(
        JSON.stringify({ error: 'Certificate ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getServiceClient()

    const { data: alumni } = await supabase
      .from('alumni')
      .select('full_name_en, full_name_he, cohort_start, cohort_end, certificate_id, created_at')
      .eq('certificate_id', cert_id)
      .single()

    if (!alumni) {
      return new Response(
        JSON.stringify({ error: 'Certificate not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ data: alumni }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
