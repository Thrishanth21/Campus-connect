-- Add the detail fields required by the Campus Connect event form.
-- This does not insert/delete rows or modify existing columns/policies.
-- Existing rows receive the defaults below; their date remains NULL until updated.

BEGIN;

ALTER TABLE public."Events"
  ADD COLUMN IF NOT EXISTS tagline text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Workshop',
  ADD COLUMN IF NOT EXISTS date date,
  ADD COLUMN IF NOT EXISTS time text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS building text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS organizer_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS organizer_role text NOT NULL DEFAULT 'Organizer',
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS prerequisites text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS schedule jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS accent_color text NOT NULL DEFAULT '#2563EB',
  ADD COLUMN IF NOT EXISTS is_spotlight boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags jsonb NOT NULL DEFAULT '[]'::jsonb;

NOTIFY pgrst, 'reload schema';

COMMIT;
