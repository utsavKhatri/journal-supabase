'use client';

import { Button } from '@/components/ui/button';

/**
 * A client-side error boundary component for Next.js applications.
 * This component catches and handles runtime errors that occur within its child components.
 * It displays a user-friendly error message and provides a "Try again" button
 * that attempts to re-render the component tree.
 */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-semibold text-red-600 dark:text-red-400">
        Something went wrong!
      </h2>
      <Button onClick={() => reset()} variant={'destructive'}>
        Try again
      </Button>
    </div>
  );
}
