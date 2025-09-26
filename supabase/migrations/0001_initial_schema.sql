-- Create Entries Table
CREATE TABLE "entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "date" date NOT NULL DEFAULT now(),
  "mood" text,
  "content" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Create Preferences Table
CREATE TABLE "preferences" (
  "user_id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "reminder_time" time,
  "default_moods" jsonb
);

-- Enable Row-Level Security for Entries
ALTER TABLE "entries" ENABLE ROW LEVEL SECURITY;

-- Create Policy for Entries: Users can only see their own entries
CREATE POLICY "user_can_read_own_entries"
ON "entries" FOR SELECT
USING (auth.uid() = user_id);

-- Create Policy for Entries: Users can insert their own entries
CREATE POLICY "user_can_create_own_entries"
ON "entries" FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create Policy for Entries: Users can update their own entries
CREATE POLICY "user_can_update_own_entries"
ON "entries" FOR UPDATE
USING (auth.uid() = user_id);

-- Create Policy for Entries: Users can delete their own entries
CREATE POLICY "user_can_delete_own_entries"
ON "entries" FOR DELETE
USING (auth.uid() = user_id);

-- Enable Row-Level Security for Preferences
ALTER TABLE "preferences" ENABLE ROW LEVEL SECURITY;

-- Create Policy for Preferences: Users can only see their own preferences
CREATE POLICY "user_can_read_own_preferences"
ON "preferences" FOR SELECT
USING (auth.uid() = user_id);

-- Create Policy for Preferences: Users can insert their own preferences
CREATE POLICY "user_can_create_own_preferences"
ON "preferences" FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create Policy for Preferences: Users can update their own preferences
CREATE POLICY "user_can_update_own_preferences"
ON "preferences" FOR UPDATE
USING (auth.uid() = user_id);

-- Create Policy for Preferences: Users can delete their own preferences
CREATE POLICY "user_can_delete_own_preferences"
ON "preferences" FOR DELETE
USING (auth.uid() = user_id);
