'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

/**
 * The DeleteEntryButton component provides a button that, when clicked, opens a confirmation dialog
 * to prevent accidental deletion of a journal entry. Upon confirmation, it deletes the specified
 * entry from the database.
 */
export function DeleteEntryButton({ entryId }: { entryId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Handles the deletion of the journal entry.
   * It sets the loading state, communicates with Supabase to delete the entry,
   * and then redirects to the homepage and refreshes the page on success.
   */
  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId);
      if (error) throw error;
      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </AlertDialogContent>
    </AlertDialog>
  );
}
