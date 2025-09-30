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
 * The DeleteAccountButton component provides a button that allows a user to permanently delete their account.
 * It triggers a confirmation dialog to prevent accidental deletion. Upon confirmation, it invokes a Supabase
 * function to delete the user's data and then signs the user out.
 */
export function DeleteAccountButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Handles the account deletion process.
   * It sets the loading state, invokes the 'delete-user' Supabase function, signs the user out,
   * and then redirects to the homepage.
   */
  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError('User is not logged in on the client side.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) throw error;
      await supabase.auth.signOut();
      router.push('/auth/login'); // Redirects to the login page
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
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and all your data.
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
