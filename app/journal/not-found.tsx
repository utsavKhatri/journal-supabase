import React from "react";
import Link from "next/link";

/**
 * A component to be displayed when the journal page or its entries are not found.
 * It provides a user-friendly message and a link to navigate to the main journal page.
 */
export default function JournalNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Journal not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&#39;t find any journal entries.
        </p>
        <div className="mt-4">
          <Link href="/journal" className="underline">
            Go to journal
          </Link>
        </div>
      </div>
    </div>
  );
}
