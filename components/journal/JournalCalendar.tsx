"use client";

import { Calendar } from "@/components/ui/calendar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Entry } from "@/lib/types";
import { cn, toKeyFromLocalDate, toLocalDateOnly } from "@/lib/utils";
import { useMemo } from "react";
import { CalendarDays, TrendingUp, BarChart3 } from "lucide-react";

export function JournalCalendar({
  entries,
  className,
  month,
  year,
}: {
  entries: Pick<Entry, "id" | "date">[];
  className?: string;
  month: number;
  year: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memoize processed data for better performance
  const { entryCounts, entryMap, maxCount, intensityDates } = useMemo(() => {
    const counts = new Map<string, number>();
    const map = new Map<string, string>();

    entries.forEach((entry) => {
      const date = toLocalDateOnly(entry.date);
      const dateKey = toKeyFromLocalDate(date);
      const count = counts.get(dateKey) || 0;

      counts.set(dateKey, count + 1);

      if (!map.has(dateKey)) {
        map.set(dateKey, entry.id);
      }
    });

    const max = Math.max(0, ...Array.from(counts.values()));

    const getIntensityLevel = (count: number): number => {
      if (count === 0 || max === 0) return 0;
      const ratio = count / max;
      if (ratio >= 0.75) return 4;
      if (ratio >= 0.5) return 3;
      if (ratio >= 0.25) return 2;
      return 1;
    };

    // Group dates by intensity level
    const intensity = {
      level1: [] as Date[],
      level2: [] as Date[],
      level3: [] as Date[],
      level4: [] as Date[],
    };

    counts.forEach((count, dateKey) => {
      const [yearStr, monthStr, dayStr] = dateKey.split("-");
      const date = new Date(
        parseInt(yearStr, 10),
        parseInt(monthStr, 10),
        parseInt(dayStr, 10)
      );
      const level = getIntensityLevel(count);

      if (level === 1) intensity.level1.push(date);
      else if (level === 2) intensity.level2.push(date);
      else if (level === 3) intensity.level3.push(date);
      else if (level === 4) intensity.level4.push(date);
    });

    return {
      entryCounts: counts,
      entryMap: map,
      maxCount: max,
      intensityDates: intensity,
    };
  }, [entries]);

  const handleDayClick = (day: Date) => {
    const dateKey = toKeyFromLocalDate(day);
    const entryId = entryMap.get(dateKey);
    if (entryId) {
      router.push(`/journal/${entryId}`);
    }
  };

  const handleMonthChange = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(date.getMonth()));
    params.set("year", String(date.getFullYear()));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("w-full max-w-max mx-auto space-y-4", className)}>
      {/* Calendar Container */}
      <div className="rounded-xl border shadow-sm p-4 sm:p-6">
        <Calendar
          mode="multiple"
          selected={[]}
          onDayClick={handleDayClick}
          month={new Date(year, month)}
          onMonthChange={handleMonthChange}
          className={cn(
            "rounded-lg mx-auto",
            "[&_.rdp-day]:p-0.5 sm:[&_.rdp-day]:p-1",
            "[&_.rdp-weekdays]:mb-1",
            "[&_.rdp-weeks]:space-y-1",
            "[--day-size:3rem] max-sm:[--day-size:2.25rem]",
            "[&_.rdp-week]:my-0!"
          )}
          modifiers={{
            hasEntries: Array.from(entryCounts.keys()).map((key) => {
              const [yearStr, monthStr, dayStr] = key.split("-");
              return new Date(
                parseInt(yearStr, 10),
                parseInt(monthStr, 10),
                parseInt(dayStr, 10)
              );
            }),
            level1: intensityDates.level1,
            level2: intensityDates.level2,
            level3: intensityDates.level3,
            level4: intensityDates.level4,
          }}
          modifiersClassNames={{
            hasEntries: "cursor-pointer transition-all",
            level1: cn(
              "!bg-emerald-500/20 !text-emerald-900 dark:!text-emerald-100",
              "hover:!bg-emerald-500/30 ",
              "!border-0 transition-all"
            ),
            level2: cn(
              "!bg-emerald-500/40 !text-emerald-900 dark:!text-emerald-100",
              "hover:!bg-emerald-500/50 ",
              "!border-0 transition-all"
            ),
            level3: cn(
              "!bg-emerald-500/60 !text-emerald-950 dark:!text-white",
              "hover:!bg-emerald-500/70",
              "!border-0 transition-all"
            ),
            level4: cn(
              "!bg-emerald-500 !text-emerald-50 dark:!text-white",
              "hover:!bg-emerald-600 ",
              "!border-0 !font-semibold transition-all"
            ),
          }}
          modifiersStyles={{
            today: {
              fontWeight: "bold",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            },
          }}
        />
      </div>

      {/* Stats Section - Improved Layout */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-lg border p-3 sm:p-4 space-y-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {entries.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Entries</div>
          </div>

          <div className="bg-card rounded-lg border p-3 sm:p-4 space-y-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {entryCounts.size}
            </div>
            <div className="text-xs text-muted-foreground">Days Active</div>
          </div>

          <div className="bg-card rounded-lg border p-3 sm:p-4 space-y-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {maxCount > 0 ? maxCount : 0}
            </div>
            <div className="text-xs text-muted-foreground">Max/Day</div>
          </div>
        </div>
      )}

      {/* Legend - Better Visual Design */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-medium text-muted-foreground">
            Activity Level
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-sm bg-muted border border-border"
                title="No entries"
              />
              <div
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-sm bg-emerald-500/20"
                title="Low activity"
              />
              <div
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-sm bg-emerald-500/40"
                title="Medium activity"
              />
              <div
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-sm bg-emerald-500/60"
                title="High activity"
              />
              <div
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-sm bg-emerald-500"
                title="Very high activity"
              />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No journal entries for this month
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Start writing to track your activity
          </p>
        </div>
      )}
    </div>
  );
}
