/**
 * This file contains the data access layer for the application.
 * It provides functions to interact with the Supabase database for client-side operations.
 */
import { createClient } from '@/lib/supabase/client';
import { Entry } from '@/lib/types';

type SaveEntryPayload = {
  content: string;
  mood: string | null;
  date: Date | undefined;
  entry?: Pick<Entry, 'id'>;
  userId: string;
};

/**
 * Saves a journal entry to the database.
 * It can either create a new entry or update an existing one, based on whether an entry ID is provided.
 */
export const saveEntry = async (payload: SaveEntryPayload) => {
  const supabase = createClient();
  const { content, mood, date, entry, userId } = payload;

  if (entry) {
    // Update existing entry
    const { data, error } = await supabase
      .from('entries')
      .update({
        content,
        mood,
        date: date?.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', entry.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(
        'Failed to update entry. Entry not found or no permissions.',
      );
    }
  } else {
    // Create new entry
    const { error } = await supabase.from('entries').insert({
      content,
      mood,
      date: date?.toISOString(),
      user_id: userId,
    });
    if (error) throw error;
  }
};

/**
 * Fetches all journal entries for the current user for export.
 */
export const getEntriesForExport = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: entries, error } = await supabase
      .from('entries')
      .select('date, mood, content')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return entries;
  }
  return [];
};
