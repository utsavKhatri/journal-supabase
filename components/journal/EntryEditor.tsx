"use client";

import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
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

const moods = [
  { emoji: "😊", name: "Happy" },
  { emoji: "🧘", name: "Calm" },
  { emoji: "🎉", name: "Excited" },
  { emoji: "😢", name: "Sad" },
  { emoji: "🤔", name: "Thoughtful" },
];

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

  useEffect(() => {
    if (entry && entry.content) {
      setContent(entry.content);
      setMood(entry.mood);
      setDate(new Date(entry.date));
      const isStandardMood = moods.some((m) => m.emoji === entry.mood);
      if (!isStandardMood) {
        setIsCustomMood(true);
      }
    }
  }, [entry]);

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
      let error;
      if (entry) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from("entries")
          .update({
            content,
            mood,
            date: date?.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", entry.id);
        error = updateError;
      } else {
        // Create new entry
        const { error: insertError } = await supabase.from("entries").insert({
          content,
          mood,
          date: date?.toISOString(),
          user_id: user.id,
        });
        error = insertError;
      }

      if (error) throw error;

      if (onSave) {
        onSave();
      } else {
        // Clear the form for new entries
        setContent("");
        setMood(null);
        setDate(new Date());
        setIsCustomMood(false);
      }
      // Refresh the page to show the new/updated entry
      router.refresh();
    } catch (error: unknown) {
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
        className="max-h-[50dvh] w-full rounded-l-sm rounded-r-none border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-md focus-visible:shadow-accent disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div>
        <p className="text-sm font-medium mb-2">How are you feeling?</p>
        <div className="flex flex-wrap gap-2">
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
              <p>journal entry date and cannot be changed while editing.</p>
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
