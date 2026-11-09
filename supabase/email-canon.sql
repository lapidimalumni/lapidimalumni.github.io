-- Gmail-aware email identity for alumni.
-- Gmail ignores dots in the local part and anything after '+', and
-- googlemail.com is an alias of gmail.com. Other providers are left as the
-- lowercased, trimmed address (dots are significant there).
-- email stays as stored (where mail is sent); email_canon is what identity
-- checks and lookups use.

-- ONE-TIME (2026-10-03): remove the duplicate created by the Aug 31 roster
-- import. sessions/magic_links rows cascade. Not part of schema.sql.
DELETE FROM alumni WHERE email = 'duplicate-account@example.com';

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
