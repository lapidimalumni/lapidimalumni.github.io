-- Keep-alive heartbeat for the Free plan inactivity pause.
-- Supabase pauses Free projects that receive insufficient user database
-- activity over a week. A Cloudflare Worker (workers/supabase-keepalive)
-- calls this RPC every 6 hours with the publishable key.

CREATE TABLE IF NOT EXISTS keepalive (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pinged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ping_count BIGINT NOT NULL DEFAULT 0
);
ALTER TABLE keepalive ENABLE ROW LEVEL SECURITY;  -- no policies: no direct client access
INSERT INTO keepalive (id) VALUES (1) ON CONFLICT DO NOTHING;

-- SECURITY DEFINER so anon can bump the single row without table grants.
-- Touches only the keepalive row and returns nothing sensitive.
CREATE OR REPLACE FUNCTION public.keepalive()
RETURNS TIMESTAMPTZ
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE keepalive
     SET pinged_at = NOW(), ping_count = ping_count + 1
   WHERE id = 1
  RETURNING pinged_at;
$$;

REVOKE ALL ON FUNCTION public.keepalive() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.keepalive() TO anon;
