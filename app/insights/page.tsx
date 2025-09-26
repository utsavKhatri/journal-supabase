import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MoodChart } from "@/components/journal/MoodChart";
import { WeeklyActivityChart } from "@/components/journal/WeeklyActivityChart";
import { NewEntryForm } from "@/components/journal/NewEntryForm";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { Badge } from "@/components/ui/badge";
import { startOfMonth, endOfMonth, format } from "date-fns";

export default async function InsightsPage(props: {
  searchParams?: Promise<{ month?: string; year?: string }>;
}) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const now = new Date();
  const monthNum = parseInt(searchParams?.month ?? "", 10);
  const yearNum = parseInt(searchParams?.year ?? "", 10);
  const month = Number.isNaN(monthNum)
    ? now.getMonth()
    : Math.max(0, Math.min(11, monthNum));
  const year = Number.isNaN(yearNum) ? now.getFullYear() : yearNum;

  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const startDate = format(monthStart, "yyyy-MM-dd");
  const endDate = format(monthEnd, "yyyy-MM-dd");

  const entriesPromise = supabase
    .from("entries")
    .select("id, mood, date")
    .eq("user_id", user.id);

  const calendarPromise = supabase
    .from("entries")
    .select("id, date")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate);

  const [{ data: entries }, { data: calendarEntries }] = await Promise.all([
    entriesPromise,
    calendarPromise,
  ]);

  return (
    <div className="w-full max-w-6xl max-sm:w-full px-4 max-sm:px-2">
      <h2 className="text-3xl font-bold">
        Your mindfulness journey at a glance.
      </h2>
      <main className="flex flex-col gap-8">
        {!entries || entries.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">
              You don&apos;t have any entries yet. Start journaling to see your
              insights!
            </p>
            <NewEntryForm />
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:row-span-2 md:col-span-3 p-6 max-sm:p-3">
              <JournalCalendar
                entries={calendarEntries || []}
                month={month}
                year={year}
              />
            </div>
            <div className="p-6 md:col-span-2 max-sm:p-3 relative">
              <MoodChart entries={entries} />
              <Badge variant="secondary" className="absolute top-4 right-4">
                All Time
              </Badge>
            </div>
            <div className="p-6 md:col-span-2 max-sm:p-3 relative">
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
