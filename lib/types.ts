/**
 * Defines the shape of a single journal entry.
 */
export type Entry = {
  content: string | null;
  created_at: string;
  date: string;
  id: string;
  mood: string | null;
  updated_at: string;
  user_id: string;
};