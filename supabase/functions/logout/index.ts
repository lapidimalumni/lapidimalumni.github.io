import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { getServiceClient } from '../_shared/supabase.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { session_token } = await req.json()
    if (!session_token) {
      return new Response(
        JSON.stringify({ data: { message: 'Logged out' } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getServiceClient()

    await supabase
      .from('sessions')
      .delete()
      .eq('token', session_token)

    return new Response(
      JSON.stringify({ data: { message: 'Logged out' } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
