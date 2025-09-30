import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewEntryForm } from '@/components/journal/NewEntryForm';
import SearchForm from '@/components/journal/SearchForm';
import Link from 'next/link';
import { Pagination } from '@/components/journal/Pagination';
import { cn, getBentoPattern, getTextClamp } from '@/lib/utils';
import { getJournalEntries } from '@/lib/dal';
import { format } from 'date-fns';

interface HomeProps {
  searchParams?: Promise<{
    page?: string;
    month?: string;
    year?: string;
    q?: string;
    date?: string;
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

  if (userError || !user) redirect('/auth/login');

  // Fetches journal entries with pagination, filtering, and search.
  const { entries, totalCount, totalPages, page, itemsPerPage, month, year } =
    await getJournalEntries({ user, searchParams });

  const q = String(searchParams?.q ?? '');

  return (
    <>
      <header
        className={cn(
          'mb-8 flex w-full items-center gap-4 max-sm:flex-col-reverse max-sm:items-center',
        )}
      >
        {/* Search form for filtering journal entries by keyword. */}
        <SearchForm initialQuery={q} />

        {/* Display the total number of entries for the selected month and year. */}
        {totalCount ? (
          <p className="text-muted-foreground mt-1 text-sm text-nowrap">
            {totalCount} entries for{' '}
            {searchParams?.date
              ? format(searchParams?.date, 'MMMM do, yyyy')
              : new Date(year, month).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
          </p>
        ) : null}

        {/* Form for creating a new journal entry. */}
        <NewEntryForm />
      </header>

      <main className="flex w-full flex-col gap-8">
        {entries && entries.length > 0 ? (
          <>
            {/* Display the journal entries in a responsive, bento-style grid. */}
            <div className="grid grid-flow-dense auto-rows-[160px] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {entries.map((entry, i) => {
                const pattern = getBentoPattern(i);
                return (
                  <Link
                    href={`/journal/${entry.id}`}
                    key={entry.id}
                    className={cn(
                      'bg-card text-card-foreground group hover:border-primary flex h-full flex-col gap-3 overflow-hidden rounded-xl border py-4 shadow-sm transition duration-300',
                      pattern,
                    )}
                  >
                    <CardHeader className="my-3">
                      <CardTitle className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{entry.mood}</span>
                          <span className="truncate text-lg font-semibold">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs font-normal">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                      <p
                        className={cn(
                          'text-muted-foreground journal-entry leading-relaxed',
                          getTextClamp(pattern),
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
                <div className="text-muted-foreground text-sm">
                  Showing {(page - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(page * itemsPerPage, totalCount || 0)} of{' '}
                  {totalCount} entries
                </div>
              </div>
            )}
          </>
        ) : (
          // Display a prompt to create a new entry if none exist.
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-lg px-2 py-16 text-center">
            <div className="mb-4 text-6xl">📝</div>
            <h3 className="mb-2 text-lg font-semibold">No entries yet</h3>
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
