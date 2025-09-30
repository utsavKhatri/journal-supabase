'use client';

import { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { saveEntry } from '@/lib/dal.client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Entry } from '@/lib/types';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const moods = [
  '😊 Happy',
  '🧘 Calm',
  '🎉 Excited',
  '😢 Sad',
  '🤔 Thoughtful',
  '😡 Angry',
  '😴 Tired',
  '🥳 Joyful',
];

/**
 * The EntryEditor component is a versatile form for both creating and editing journal entries.
 * When an `entry` prop is provided, it populates the form with the existing data for editing.
 * Otherwise, it presents a blank form for creating a new entry.
 * It handles state for content, mood, and date, and communicates with Supabase to save changes.
 */
export function EntryEditor({
  entry,
  onSave,
}: {
  entry?: Pick<Entry, 'id' | 'date' | 'mood' | 'content' | 'created_at'>;
  onSave?: VoidFunction;
}) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // If an entry is provided for editing, populate the form fields with its data.
  useEffect(() => {
    if (entry) {
      setContent(entry.content ?? '');
      setMood(entry.mood);
      setDate(new Date(entry.date));
    }
  }, [entry?.content, entry?.mood, entry?.date]);

  /**
   * Handles saving the journal entry, either by creating a new one or updating an existing one.
   * It validates user authentication, then sends the data to Supabase.
   */
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in to create or edit an entry.');
      setIsLoading(false);
      return;
    }

    try {
      await saveEntry({
        content,
        mood,
        date,
        entry,
        userId: user.id,
      });

      // If an onSave callback is provided, call it. Otherwise, clear the form for new entries.
      if (onSave) {
        onSave();
      } else {
        setContent('');
        setMood(null);
        setDate(new Date());
      }
      // Refresh the page to reflect the changes.
      router.refresh();
    } catch (error: unknown) {
      console.error('Error saving entry:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative grid gap-4">
      <TextareaAutosize
        minRows={5}
        placeholder="Write something beautiful..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="journal-entry border-input placeholder:text-muted-foreground focus-visible:shadow-accent max-h-[50dvh] w-full rounded-l-sm rounded-r-none border bg-transparent px-3 py-2 text-base shadow-sm focus-visible:shadow-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div>
        <p className="mb-2 text-sm font-medium">How are you feeling?</p>
        <div className="flex flex-wrap gap-2">
          {/* Render buttons for each predefined mood. */}
          {moods.map((m) => (
            <Button
              key={m}
              variant={mood === m ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMood(m);
              }}
              className="flex cursor-pointer items-center gap-2"
            >
              {m}
            </Button>
          ))}
        </div>
      </div>
      {/* When creating a new entry, allow the date to be changed via a popover calendar. */}
      {!entry ? (
        <details>
          <summary className="cursor-pointer text-sm">More settings</summary>
          <div className="grid gap-2 pt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      const utcDate = new Date(
                        Date.UTC(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          selectedDate.getDate(),
                        ),
                      );
                      setDate(utcDate);
                    } else {
                      setDate(undefined);
                    }
                  }}
                  autoFocus
                  hidden={{ after: new Date() }} // Disable future dates
                />
              </PopoverContent>
            </Popover>
          </div>
        </details>
      ) : (
        // When editing, display the date as a read-only field with a tooltip.
        <div className="grid w-fit gap-2 pt-2">
          <Tooltip>
            <TooltipTrigger>
              <Input
                className={cn(
                  'w-[280px] cursor-not-allowed justify-start text-left font-normal select-none',
                  !date && 'text-muted-foreground',
                )}
                readOnly
                value={date ? format(date, 'PPP') : ''}
              />
            </TooltipTrigger>

            <TooltipContent side="top">
              <p>The journal entry date cannot be changed while editing.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button onClick={handleSave} disabled={isLoading || !content || !mood}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Saving...' : 'Save Entry'}
        </Button>
      </div>
    </div>
  );
}
