import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewEntryForm } from "@/components/journal/NewEntryForm";
import SearchForm from "@/components/journal/SearchForm";
import Link from "next/link";
import { Pagination } from "@/components/journal/Pagination";
import { cn, getBentoPattern, getTextClamp } from "@/lib/utils";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { User } from "@supabase/supabase-js";

interface HomeProps {
  searchParams?: Promise<{
    page?: string;
    month?: string;
    year?: string;
    q?: string;
  }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/auth/login");

  const { entries, totalCount, totalPages, page, itemsPerPage, month, year } =
    await getJournalEntries({ user, searchParams });

  const q = String(searchParams?.q ?? "");

  return (
    <>
      <header
        className={cn("mb-8 flex items-center justify-between w-full", {
          "justify-end": !totalCount,
        })}
      >
        <div>
          {totalCount ? (
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} entries for{" "}
              {new Date(year, month).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <SearchForm initialQuery={q} />
          <NewEntryForm />
        </div>
      </header>

      <main className="flex flex-col gap-8">
        {entries && entries.length > 0 ? (
          <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] grid-flow-dense">
              {entries.map((entry, i) => {
                const pattern = getBentoPattern(i, totalCount || 12);
                return (
                  <Link
                    href={`/journal/${entry.id}`}
                    key={entry.id}
                    className={cn(
                      "bg-card text-card-foreground gap-6 rounded-xl py-6 shadow-sm group h-full flex flex-col overflow-hidden border hover:border-primary transition duration-300",
                      pattern
                    )}
                  >
                    <CardHeader className="my-3">
                      <CardTitle className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{entry.mood}</span>
                          <span className="font-semibold text-lg truncate">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-normal">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                      <p
                        className={cn(
                          "text-muted-foreground leading-relaxed",
                          getTextClamp(pattern)
                        )}
                      >
                        {entry.content}
                      </p>
                    </CardContent>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  totalItems={totalCount}
                  itemsPerPage={itemsPerPage}
                />
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(page * itemsPerPage, totalCount || 0)} of{" "}
                  {totalCount} entries
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 rounded-lg flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-2">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start your mindful journey by creating your first journal entry.
              Capture your thoughts, feelings, and daily moments.
            </p>
            <NewEntryForm />
          </div>
        )}
      </main>
    </>
  );
}

/**
 * Fetches journal entries for a user with pagination, filtering by month/year, and search query.
 */
const getJournalEntries = async ({
  user,
  searchParams,
}: {
  user: User;
  searchParams:
    | {
        page?: string | undefined;
        month?: string | undefined;
        year?: string | undefined;
        q?: string | undefined;
      }
    | undefined;
}) => {
  const supabase = await createClient();
  const now = new Date();
  const pageNum = parseInt(searchParams?.page ?? "", 10);
  const page = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  const itemsPerPage = 7;

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

  const q = (searchParams?.q ?? "").trim();
  const hasQuery = q.length > 0;

  const countQuery = supabase
    .from("entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate);

  if (hasQuery) {
    countQuery.or(`content.ilike.%${q}%,mood.ilike.%${q}%`);
  }

  const { count: totalCount, error: countError } = await countQuery;

  if (countError) throw countError;

  const dataQuery = supabase
    .from("entries")
    .select("id, date, mood, content, created_at")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate);

  if (hasQuery) {
    dataQuery.or(`content.ilike.%${q}%,mood.ilike.%${q}%`);
  }

  const { data: entries, error: entriesError } = await dataQuery
    .order("date", { ascending: false })
    .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

  if (entriesError) throw entriesError;

  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  return { entries, totalCount, totalPages, page, itemsPerPage, month, year };
};
