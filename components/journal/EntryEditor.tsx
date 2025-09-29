"use client";

import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { saveEntry } from "@/lib/dal.client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Entry } from "@/lib/types";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Predefined moods for the user to select from.
const moods = [
  { emoji: "😊", name: "Happy" },
  { emoji: "🧘", name: "Calm" },
  { emoji: "🎉", name: "Excited" },
  { emoji: "😢", name: "Sad" },
  { emoji: "🤔", name: "Thoughtful" },
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
  entry?: Pick<Entry, "id" | "date" | "mood" | "content" | "created_at">;
  onSave?: VoidFunction;
}) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCustomMood, setIsCustomMood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // If an entry is provided for editing, populate the form fields with its data.
  useEffect(() => {
    if (entry) {
      setContent(entry.content ?? "");
      setMood(entry.mood);
      setDate(new Date(entry.date));
      const isStandardMood = moods.some((m) => m.emoji === entry.mood);
      if (!isStandardMood) {
        setIsCustomMood(true);
      }
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
      setError("You must be logged in to create or edit an entry.");
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
        setContent("");
        setMood(null);
        setDate(new Date());
        setIsCustomMood(false);
      }
      // Refresh the page to reflect the changes.
      router.refresh();
    } catch (error: unknown) {
      console.error("Error saving entry:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid relative gap-4">
      <TextareaAutosize
        minRows={5}
        placeholder="Write something beautiful..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="max-h-[50dvh] journal-entry w-full rounded-l-sm rounded-r-none border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-md focus-visible:shadow-accent disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div>
        <p className="text-sm font-medium mb-2">How are you feeling?</p>
        <div className="flex flex-wrap gap-2">
          {/* Render buttons for each predefined mood. */}
          {moods.map((m) => (
            <Button
              key={m.emoji}
              variant={
                mood === m.emoji && !isCustomMood ? "default" : "outline"
              }
              size="sm"
              onClick={() => {
                setMood(m.emoji);
                setIsCustomMood(false);
              }}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{m.emoji}</span>
              {m.name}
            </Button>
          ))}
          {/* Show an "Other" button to allow for custom mood input when creating a new entry. */}
          {!entry && (
            <Button
              variant={isCustomMood ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsCustomMood(true);
                setMood("");
              }}
            >
              Other
            </Button>
          )}
        </div>
        {isCustomMood && !entry && (
          <Input
            type="text"
            placeholder="Enter your mood"
            value={mood ?? ""}
            onChange={(e) => setMood(e.target.value)}
            className="mt-2"
          />
        )}
      </div>
      {/* When creating a new entry, allow the date to be changed via a popover calendar. */}
      {!entry ? (
        <details>
          <summary className="text-sm cursor-pointer">More settings</summary>
          <div className="grid gap-2 pt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </details>
      ) : (
        // When editing, display the date as a read-only field with a tooltip.
        <div className="grid gap-2 pt-2 w-fit">
          <Tooltip>
            <TooltipTrigger>
              <Input
                className={cn(
                  "w-[280px] justify-start text-left font-normal cursor-not-allowed select-none",
                  !date && "text-muted-foreground"
                )}
                readOnly
                value={date ? format(date, "PPP") : ""}
              />
            </TooltipTrigger>

            <TooltipContent side="top">
              <p>The journal entry date cannot be changed while editing.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className="flex justify-end items-center gap-2">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button onClick={handleSave} disabled={isLoading || !content || !mood}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </div>
  );
}
