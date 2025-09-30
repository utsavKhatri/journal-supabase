import React from 'react';
import Link from 'next/link';

/**
 * A component to be displayed when the settings page is not found.
 * It provides a user-friendly message and a link to navigate back to the homepage.
 */
export default function SettingsNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Settings not found</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          We couldn&#39;t find these settings.
        </p>
        <div className="mt-4">
          <Link href="/" className="underline">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
