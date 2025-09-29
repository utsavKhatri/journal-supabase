import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewEntryForm } from "@/components/journal/NewEntryForm";
import SearchForm from "@/components/journal/SearchForm";
import Link from "next/link";
import { Pagination } from "@/components/journal/Pagination";
import { cn, getBentoPattern, getTextClamp } from "@/lib/utils";
import { getJournalEntries } from "@/lib/dal";

interface HomeProps {
  searchParams?: Promise<{
    page?: string;
    month?: string;
    year?: string;
    q?: string;
  }>;
}

/**
 * The Home page component serves as the main dashboard for the journal.
 * It displays a list of journal entries in a bento-style grid, provides
 * search and pagination functionality, and prompts the user to create an entry
 * if none exist.
 */
export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/auth/login");

  // Fetches journal entries with pagination, filtering, and search.
  const { entries, totalCount, totalPages, page, itemsPerPage, month, year } =
    await getJournalEntries({ user, searchParams });

  const q = String(searchParams?.q ?? "");

  return (
    <>
      <header
        className={cn(
          "mb-8 flex items-center justify-between w-full max-sm:flex-col max-sm:px-3 gap-3",
          {
            "justify-end": !totalCount,
          }
        )}
      >
        <div>
          {/* Display the total number of entries for the selected month and year. */}
          {totalCount ? (
            <p className="text-sm text-muted-foreground mt-1 text-nowrap">
              {totalCount} entries for{" "}
              {new Date(year, month).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-4 max-sm:items-center w-full max-sm:flex-col-reverse">
          <SearchForm initialQuery={q} />
          <NewEntryForm />
        </div>
      </header>

      <main className="flex flex-col gap-8 w-full">
        {entries && entries.length > 0 ? (
          <>
            {/* Display the journal entries in a responsive, bento-style grid. */}
            <div className=" grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] grid-flow-dense">
              {entries.map((entry, i) => {
                const pattern = getBentoPattern(i, totalCount || 12);
                return (
                  <Link
                    href={`/journal/${entry.id}`}
                    key={entry.id}
                    className={cn(
                      "bg-card text-card-foreground gap-3 rounded-xl py-4 shadow-sm group h-full flex flex-col overflow-hidden border hover:border-primary transition duration-300",
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
                          "text-muted-foreground leading-relaxed journal-entry",
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

            {/* Render pagination controls if there is more than one page of entries. */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
                <Pagination totalPages={totalPages} currentPage={page} />
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(page * itemsPerPage, totalCount || 0)} of{" "}
                  {totalCount} entries
                </div>
              </div>
            )}
          </>
        ) : (
          // Display a prompt to create a new entry if none exist.
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
