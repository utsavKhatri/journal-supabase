'use client';

import { Calendar } from '@/components/ui/calendar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Entry } from '@/lib/types';
import { cn, processCalendarEntries, toKeyFromLocalDate } from '@/lib/utils';
import { useMemo } from 'react';
import { CalendarDays, TrendingUp, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

/**
 * The JournalCalendar component displays an interactive calendar that visualizes journal entry activity.
 * Days with entries are highlighted, and the intensity of the color indicates the number of entries on that day.
 * It also shows summary statistics and allows navigation between months.
 */
export function JournalCalendar({
  entries,
  className,
  month,
  year,
}: {
  entries: Pick<Entry, 'id' | 'date'>[];
  className?: string;
  month: number;
  year: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { entryCounts, entryMap, maxCount, intensityDates } = useMemo(
    () => processCalendarEntries(entries),
    [entries],
  );

  /**
   * Navigates to the detailed view of a journal entry when a day with an entry is clicked.
   */
  const handleDayClick = (day: Date) => {
    const dateKey = toKeyFromLocalDate(day);
    const entriesForDay = entryMap.get(dateKey);

    if (entriesForDay && entriesForDay.length > 0) {
      if (entriesForDay.length === 1) {
        router.push(`/journal/${entriesForDay[0].id}`);
      } else {
        router.push('/?date=' + format(day, 'yyyy-MM-dd'));
      }
    }
  };

  /**
   * Handles month changes in the calendar, updating the URL search parameters to reflect the new month and year.
   */
  const handleMonthChange = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', String(date.getMonth()));
    params.set('year', String(date.getFullYear()));
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-max space-y-4 max-sm:max-w-full',
        className,
      )}
    >
      <div className="rounded-xl border p-4 shadow-sm sm:p-6">
        <Calendar
          mode="multiple"
          selected={[]}
          onDayClick={handleDayClick}
          month={new Date(year, month)}
          onMonthChange={handleMonthChange}
          className={cn(
            'mx-auto rounded-lg',
            '[&_.rdp-day]:p-0.5 sm:[&_.rdp-day]:p-1',
            '[&_.rdp-weekdays]:mb-1',
            '[&_.rdp-weeks]:space-y-1',
            '[--day-size:3rem] max-sm:[--day-size:2.25rem]',
            '[&_.rdp-week]:my-0!',
          )}
          modifiers={{
            hasEntries: Array.from(entryCounts.keys()).map((key) => {
              const [yearStr, monthStr, dayStr] = key.split('-');
              return new Date(
                parseInt(yearStr, 10),
                parseInt(monthStr, 10),
                parseInt(dayStr, 10),
              );
            }),
            level1: intensityDates.level1,
            level2: intensityDates.level2,
            level3: intensityDates.level3,
            level4: intensityDates.level4,
          }}
          modifiersClassNames={{
            hasEntries: 'cursor-pointer transition-all',
            level1: cn(
              '!bg-emerald-500/20 !text-emerald-900 dark:!text-emerald-100',
              'hover:!bg-emerald-500/30 ',
              '!border-0 transition-all',
            ),
            level2: cn(
              '!bg-emerald-500/40 !text-emerald-900 dark:!text-emerald-100',
              'hover:!bg-emerald-500/50 ',
              '!border-0 transition-all',
            ),
            level3: cn(
              '!bg-emerald-500/60 !text-emerald-950 dark:!text-white',
              'hover:!bg-emerald-500/70',
              '!border-0 transition-all',
            ),
            level4: cn(
              '!bg-emerald-500 !text-emerald-50 dark:!text-white',
              'hover:!bg-emerald-600 ',
              '!border-0 !font-semibold transition-all',
            ),
          }}
          modifiersStyles={{
            today: {
              fontWeight: 'bold',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            },
          }}
        />
      </div>

      {/* Display summary statistics if there are entries for the month. */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card space-y-1 rounded-lg border p-3 transition-shadow hover:shadow-md sm:p-4">
            <div className="flex items-center justify-between">
              <CalendarDays className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="text-xl font-bold sm:text-2xl">
              {entries.length}
            </div>
            <div className="text-muted-foreground text-xs">Total Entries</div>
          </div>

          <div className="bg-card space-y-1 rounded-lg border p-3 transition-shadow hover:shadow-md sm:p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="text-xl font-bold sm:text-2xl">
              {entryCounts.size}
            </div>
            <div className="text-muted-foreground text-xs">Days Active</div>
          </div>

          <div className="bg-card space-y-1 rounded-lg border p-3 transition-shadow hover:shadow-md sm:p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="text-xl font-bold sm:text-2xl">
              {maxCount > 0 ? maxCount : 0}
            </div>
            <div className="text-muted-foreground text-xs">Max/Day</div>
          </div>
        </div>
      )}

      {/* Legend explaining the color-coded activity levels. */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-xs font-medium">
            Activity Level
          </span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Less</span>
            <div className="flex gap-1">
              <div
                className="bg-muted border-border h-3 w-3 rounded-sm border sm:h-4 sm:w-4"
                title="No entries"
              />
              <div
                className="h-3 w-3 rounded-sm bg-emerald-500/20 sm:h-4 sm:w-4"
                title="Low activity"
              />
              <div
                className="h-3 w-3 rounded-sm bg-emerald-500/40 sm:h-4 sm:w-4"
                title="Medium activity"
              />
              <div
                className="h-3 w-3 rounded-sm bg-emerald-500/60 sm:h-4 sm:w-4"
                title="High activity"
              />
              <div
                className="h-3 w-3 rounded-sm bg-emerald-500 sm:h-4 sm:w-4"
                title="Very high activity"
              />
            </div>
            <span className="text-muted-foreground text-xs">More</span>
          </div>
        </div>
      </div>

      {/* Display a message if there are no entries for the selected month. */}
      {entries.length === 0 && (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <CalendarDays className="text-muted-foreground/50 mx-auto mb-3 h-12 w-12" />
          <p className="text-muted-foreground text-sm">
            No journal entries for this month
          </p>
          <p className="text-muted-foreground/70 mt-1 text-xs">
            Start writing to track your activity
          </p>
        </div>
      )}
    </div>
  );
}
