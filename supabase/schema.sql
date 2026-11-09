-- Lapidim Alumni Database Schema

-- Alumni table
CREATE TABLE IF NOT EXISTS alumni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name_en TEXT NOT NULL,
  full_name_he TEXT NOT NULL,
  cohort_start INTEGER NOT NULL,
  cohort_end INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'alumni' CHECK (role IN ('admin', 'alumni')),
  linkedin_url TEXT,
  certificate_id TEXT UNIQUE NOT NULL,
  email_updates BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Magic links table
CREATE TABLE IF NOT EXISTS magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  token UUID UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  token UUID UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables (no policies = no client access; all access via service_role key)
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Function to generate a random certificate ID (LAPD-ALMN-XXXXXXXX)
-- Uses a 30-char alphabet (excludes ambiguous chars 0, O, 1, I)
CREATE OR REPLACE FUNCTION generate_certificate_id()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  cert_id TEXT;
  i INTEGER;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    cert_id := 'LAPD-ALMN-' || result;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM alumni WHERE certificate_id = cert_id);
  END LOOP;
  RETURN cert_id;
END;
$$;

-- Seed: insert yourself as first admin (update values as needed)
-- INSERT INTO alumni (email, full_name_en, full_name_he, cohort_start, cohort_end, role, certificate_id)
-- VALUES ('your@email.com', 'Your Name', 'שמך', 2019, 2019, 'admin', generate_certificate_id());

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

-- Gmail-aware email identity (see supabase/email-canon.sql)
CREATE OR REPLACE FUNCTION public.canonical_email(addr TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
STRICT
PARALLEL SAFE
SET search_path = ''
AS $$
  SELECT CASE
    WHEN split_part(e, '@', 2) IN ('gmail.com', 'googlemail.com')
      THEN replace(split_part(split_part(e, '@', 1), '+', 1), '.', '') || '@gmail.com'
    ELSE e
  END
  FROM (SELECT lower(btrim(addr)) AS e) s;
$$;

ALTER TABLE alumni
  ADD COLUMN IF NOT EXISTS email_canon TEXT
  GENERATED ALWAYS AS (public.canonical_email(email)) STORED;

-- Fails if any canonical duplicates remain; run the collision query first.
CREATE UNIQUE INDEX IF NOT EXISTS alumni_email_canon_key ON alumni (email_canon);

-- Events shown on the members page. Managed from the admin console.
-- Whether an event is "upcoming" or "past" is derived from event_date, so
-- nothing needs flipping after a meetup happens.
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_he TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  description_he TEXT NOT NULL DEFAULT '',
  event_date DATE NOT NULL,
  time_text TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  location_he TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  registration_link TEXT,
  recap_link TEXT,
  feedback_link TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;  -- no policies: all access via service_role

-- Seed the first meetup (skipped if the table already has rows).
INSERT INTO events (title, title_he, description, description_he, event_date, time_text, location, location_he, image, registration_link)
SELECT
  'First Lapidim Alumni Conference',
  'כנס בוגרי לפידים הראשון',
  'Join us for the first Lapidim Program alumni conference, at the Taub Building, Technion.',
  'הצטרפו אלינו לכנס הראשון של בוגרי תוכנית לפידים, בבניין טאוב בטכניון.',
  '2026-10-29',
  '18:00 - 21:00',
  'Taub Building, Technion',
  'בניין טאוב, טכניון',
  '/images/events/alumni-gathering-2026.jpg',
  'https://docs.google.com/forms/d/e/1FAIpQLScPNvzFYVmivM_XkH9T-LFarxrmgXh6Y-Su9vggYaEnVotc8Q/viewform'
WHERE NOT EXISTS (SELECT 1 FROM events);

-- Migration for databases created before feedback links existed:
ALTER TABLE events ADD COLUMN IF NOT EXISTS feedback_link TEXT;
