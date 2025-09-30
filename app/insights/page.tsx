import { MoodChart } from '@/components/journal/MoodChart';
import { WeeklyActivityChart } from '@/components/journal/WeeklyActivityChart';
import { NewEntryForm } from '@/components/journal/NewEntryForm';
import { JournalCalendar } from '@/components/journal/JournalCalendar';
import { Badge } from '@/components/ui/badge';
import { getInsightsPageData } from '@/lib/dal';

/**
 * The Insights page provides a comprehensive overview of the user's journaling activity.
 * It features a calendar view of entries, a mood distribution chart, and a weekly activity chart.
 * If the user has no entries, it prompts them to start journaling.
 */
export default async function InsightsPage(props: {
  searchParams?: Promise<{ month?: string; year?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { entries, calendarEntries, month, year } =
    await getInsightsPageData(searchParams);

  return (
    <div className="w-full max-w-6xl px-4 max-sm:w-full max-sm:px-2">
      <h2 className="text-3xl font-bold max-sm:text-center max-sm:text-xl">
        Your mindfulness journey at a glance.
      </h2>
      <main className="flex flex-col gap-8">
        {/* If there are no entries, display a welcome message and a button to create a new entry. */}
        {!entries || entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
            <p className="text-muted-foreground mb-4">
              You don&apos;t have any entries yet. Start journaling to see your
              insights!
            </p>
            <NewEntryForm />
          </div>
        ) : (
          // Otherwise, display the insights dashboard with the calendar and charts.
          <div className="grid gap-8 md:grid-cols-5">
            <div className="p-6 max-sm:p-3 md:col-span-3 md:row-span-2">
              <JournalCalendar
                entries={calendarEntries || []}
                month={month}
                year={year}
              />
            </div>
            <div className="relative p-6 max-sm:p-3 md:col-span-2">
              <MoodChart entries={entries} />
              <Badge variant="secondary" className="absolute top-4 right-4">
                All Time
              </Badge>
            </div>
            <div className="relative p-6 max-sm:p-3 md:col-span-2">
              <WeeklyActivityChart entries={entries} />
              <Badge variant="secondary" className="absolute top-4 right-4">
                All Time
              </Badge>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
