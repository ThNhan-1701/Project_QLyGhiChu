CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  is_pinned BOOLEAN DEFAULT FALSE,
  mood TEXT NOT NULL DEFAULT 'focus',
  note_style TEXT NOT NULL DEFAULT 'classic',
  cover_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

ALTER TABLE notes ADD COLUMN IF NOT EXISTS mood TEXT NOT NULL DEFAULT 'focus';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS note_style TEXT NOT NULL DEFAULT 'classic';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notes_mood_check'
      AND conrelid = 'notes'::regclass
  ) THEN
    ALTER TABLE notes ADD CONSTRAINT notes_mood_check
      CHECK (mood IN ('focus', 'happy', 'idea', 'urgent', 'calm', 'win', 'messy', 'important'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notes_note_style_check'
      AND conrelid = 'notes'::regclass
  ) THEN
    ALTER TABLE notes ADD CONSTRAINT notes_note_style_check
      CHECK (note_style IN ('classic', 'neon', 'calm', 'paper', 'focus'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notes_updated_at ON notes;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notes_select" ON notes;
DROP POLICY IF EXISTS "notes_insert" ON notes;
DROP POLICY IF EXISTS "notes_update" ON notes;
DROP POLICY IF EXISTS "notes_delete" ON notes;

CREATE POLICY "notes_select" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete" ON notes FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tags_select" ON tags;
DROP POLICY IF EXISTS "tags_insert" ON tags;
DROP POLICY IF EXISTS "tags_update" ON tags;
DROP POLICY IF EXISTS "tags_delete" ON tags;

CREATE POLICY "tags_select" ON tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tags_insert" ON tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tags_update" ON tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tags_delete" ON tags FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "note_tags_all" ON note_tags;
DROP POLICY IF EXISTS "note_tags_select" ON note_tags;
DROP POLICY IF EXISTS "note_tags_insert" ON note_tags;
DROP POLICY IF EXISTS "note_tags_delete" ON note_tags;

CREATE POLICY "note_tags_select" ON note_tags FOR SELECT USING (
  EXISTS (SELECT 1 FROM notes WHERE notes.id = note_tags.note_id AND notes.user_id = auth.uid())
);

CREATE POLICY "note_tags_insert" ON note_tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM notes WHERE notes.id = note_tags.note_id AND notes.user_id = auth.uid())
  AND EXISTS (SELECT 1 FROM tags WHERE tags.id = note_tags.tag_id AND tags.user_id = auth.uid())
);

CREATE POLICY "note_tags_delete" ON note_tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM notes WHERE notes.id = note_tags.note_id AND notes.user_id = auth.uid())
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('note-covers', 'note-covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "note_covers_select" ON storage.objects;
DROP POLICY IF EXISTS "note_covers_insert" ON storage.objects;
DROP POLICY IF EXISTS "note_covers_update" ON storage.objects;
DROP POLICY IF EXISTS "note_covers_delete" ON storage.objects;

CREATE POLICY "note_covers_select" ON storage.objects FOR SELECT USING (
  bucket_id = 'note-covers'
);

CREATE POLICY "note_covers_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'note-covers'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "note_covers_update" ON storage.objects FOR UPDATE USING (
  bucket_id = 'note-covers'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "note_covers_delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'note-covers'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE INDEX IF NOT EXISTS notes_user_updated_at_idx ON notes (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS notes_user_pinned_idx ON notes (user_id, is_pinned DESC);
CREATE INDEX IF NOT EXISTS notes_user_mood_idx ON notes (user_id, mood);
CREATE INDEX IF NOT EXISTS notes_user_note_style_idx ON notes (user_id, note_style);
CREATE INDEX IF NOT EXISTS tags_user_name_idx ON tags (user_id, name);
CREATE INDEX IF NOT EXISTS note_tags_tag_id_idx ON note_tags (tag_id);
CREATE INDEX IF NOT EXISTS notes_title_content_search_idx ON notes USING GIN (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, ''))
);
