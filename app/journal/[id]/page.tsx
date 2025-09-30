import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { EditEntryForm } from '@/components/journal/EditEntryForm';
import { DeleteEntryButton } from '@/components/journal/DeleteEntryButton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * The EntryDetailPage component is responsible for fetching and displaying a single journal entry.
 * It retrieves the entry ID from the URL parameters, fetches the corresponding data from Supabase,
 * and renders it in a card format. It also includes options to edit or delete the entry.
 */
export default async function EntryDetailPage({
  params,
}: PageProps<'/journal/[id]'>) {
  const supabase = await createClient();

  // Fetches a single journal entry from the database using the ID from the URL params.
  const { data: entry, error } = await supabase
    .from('entries')
    .select('id, date, mood, content, created_at')
    .eq('id', (await params).id)
    .single();

  // If the entry is not found or an error occurs, redirect the user to the homepage.
  if (error || !entry) {
    redirect('/');
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <div className="w-full max-w-2xl px-4 md:px-0">
        <div className="mb-4 flex items-center justify-between">
          {/* Navigation button to go back to the main journal page. */}
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Link>
          </Button>
          {/* Action buttons for editing and deleting the entry. */}
          <div className="flex gap-2">
            <EditEntryForm entry={entry} />
            <DeleteEntryButton entryId={entry.id} />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-2xl text-nowrap max-sm:text-xl">
              {/* Displays the mood and formatted date of the journal entry. */}
              <span>{entry.mood}</span>
              <span>
                {new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </CardTitle>
            <CardDescription>Your mindful moment</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Displays the main content of the journal entry, preserving whitespace. */}
            <p className="journal-entry text-lg whitespace-pre-wrap">
              {entry.content}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
